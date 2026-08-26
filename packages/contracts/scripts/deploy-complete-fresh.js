const hre = require("hardhat");
const { ethers, upgrades } = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Complete fresh deployment with all contracts working together
 */
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Complete Fresh Deployment");
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  const deployed = {};

  // 1. Deploy MockUSDC with PUBLIC mint
  console.log("1️⃣  Deploying MockUSDC...");
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const usdc = await MockERC20.deploy("USD Coin", "USDC", 6);
  await usdc.waitForDeployment();
  deployed.USDC = await usdc.getAddress();
  console.log("   ✅ USDC:", deployed.USDC);

  // 2. Deploy aUSDC
  console.log("\n2️⃣  Deploying aUSDC...");
  const aUsdc = await MockERC20.deploy("Aave USDC", "aUSDC", 6);
  await aUsdc.waitForDeployment();
  deployed.aUSDC = await aUsdc.getAddress();
  console.log("   ✅ aUSDC:", deployed.aUSDC);

  // 3. Deploy MockAavePool
  console.log("\n3️⃣  Deploying MockAavePool...");
  const MockAavePool = await ethers.getContractFactory("MockAavePool");
  const aavePool = await MockAavePool.deploy(deployed.USDC, deployed.aUSDC);
  await aavePool.waitForDeployment();
  deployed.AAVE_POOL = await aavePool.getAddress();
  console.log("   ✅ AavePool:", deployed.AAVE_POOL);

  // 4. Deploy FBT
  console.log("\n4️⃣  Deploying NdaFundPlatform Token...");
  const FBT = await ethers.getContractFactory("NdaFundPlatformToken");
  const fbt = await upgrades.deployProxy(FBT, [deployer.address], { kind: "uups" });
  await fbt.waitForDeployment();
  deployed.FBT = await fbt.getAddress();
  console.log("   ✅ FBT:", deployed.FBT);

  // 5. Deploy ReceiptOFT
  console.log("\n5️⃣  Deploying ReceiptOFT...");
  const ReceiptOFT = await ethers.getContractFactory("ReceiptOFT");
  const lzEndpoint = "0x6EDCE65403992e310A62460808c4b910D972f10f";
  const receiptOFT = await ReceiptOFT.deploy("NdaFundPlatform Receipt", "rcptUSDC", lzEndpoint, deployer.address);
  await receiptOFT.waitForDeployment();
  deployed.ReceiptOFT = await receiptOFT.getAddress();
  console.log("   ✅ ReceiptOFT:", deployed.ReceiptOFT);

  // 6. Deploy WealthBuildingDonation (with deployer as temporary treasury)
  console.log("\n6️⃣  Deploying WealthBuildingDonation...");
  const WBD = await ethers.getContractFactory("WealthBuildingDonation");
  const wbd = await upgrades.deployProxy(
    WBD,
    [
      deployed.AAVE_POOL,
      deployed.USDC,
      deployed.aUSDC,
      ethers.ZeroAddress, // swapAdapter
      deployer.address, // temporary treasury (will update later)
      deployer.address
    ],
    { kind: "uups" }
  );
  await wbd.waitForDeployment();
  deployed.WealthBuildingDonation = await wbd.getAddress();
  console.log("   ✅ WealthBuildingDonation:", deployed.WealthBuildingDonation);

  // 7. Deploy PlatformTreasury
  console.log("\n7️⃣  Deploying PlatformTreasury...");
  const Treasury = await ethers.getContractFactory("PlatformTreasury");
  const treasury = await upgrades.deployProxy(
    Treasury,
    [
      deployed.USDC,
      deployed.WealthBuildingDonation,
      deployed.FBT,
      deployer.address
    ],
    { kind: "uups" }
  );
  await treasury.waitForDeployment();
  deployed.PlatformTreasury = await treasury.getAddress();
  console.log("   ✅ PlatformTreasury:", deployed.PlatformTreasury);

  // 8. Update WBD treasury
  console.log("\n8️⃣  Updating WBD treasury...");
  await wbd.setPlatformTreasury(deployed.PlatformTreasury);
  console.log("   ✅ Treasury updated");

  // 9. Deploy ImpactDAOPool
  console.log("\n9️⃣  Deploying ImpactDAOPool...");
  const DAO = await ethers.getContractFactory("ImpactDAOPool");
  const dao = await upgrades.deployProxy(
    DAO,
    [deployed.FBT, deployed.USDC, deployed.AAVE_POOL, deployed.aUSDC, deployer.address],
    { kind: "uups" }
  );
  await dao.waitForDeployment();
  deployed.ImpactDAOPool = await dao.getAddress();
  console.log("   ✅ ImpactDAOPool:", deployed.ImpactDAOPool);

  // 10. Deploy Implementations
  console.log("\n🔟 Deploying Implementations...");
  const Fundraiser = await ethers.getContractFactory("Fundraiser");
  const fundraiserImpl = await Fundraiser.deploy();
  await fundraiserImpl.waitForDeployment();
  deployed.FundraiserImpl = await fundraiserImpl.getAddress();
  console.log("   ✅ FundraiserImpl:", deployed.FundraiserImpl);

  const StakingPool = await ethers.getContractFactory("StakingPool");
  const stakingImpl = await StakingPool.deploy();
  await stakingImpl.waitForDeployment();
  deployed.StakingPoolImpl = await stakingImpl.getAddress();
  console.log("   ✅ StakingPoolImpl:", deployed.StakingPoolImpl);

  // 11. Deploy Factory
  console.log("\n1️⃣1️⃣  Deploying Factory...");
  const Factory = await ethers.getContractFactory("FundraiserFactory");
  const factory = await Factory.deploy(
    deployed.FundraiserImpl,
    deployed.StakingPoolImpl,
    ethers.ZeroAddress, // No swap adapter
    deployed.USDC,
    ethers.ZeroAddress, // No WETH
    deployed.AAVE_POOL,
    deployed.aUSDC,
    ethers.ZeroAddress, // No Morpho
    0, // Aave staking type
    deployer.address
  );
  await factory.waitForDeployment();
  deployed.Factory = await factory.getAddress();
  console.log("   ✅ Factory:", deployed.Factory);

  // 12. Configure Factory
  console.log("\n1️⃣2️⃣  Configuring Factory...");
  await factory.setWealthBuildingDonation(deployed.WealthBuildingDonation);
  await factory.setImpactDAOPool(deployed.ImpactDAOPool);
  await factory.setPlatformTreasury(deployed.PlatformTreasury);
  await factory.setReceiptOFT(deployed.ReceiptOFT);
  await factory.setFBTToken(deployed.FBT);
  console.log("   ✅ Factory configured");

  // 13. Grant Permissions
  console.log("\n1️⃣3️⃣  Granting Permissions...");
  const FUNDRAISER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("FUNDRAISER_ROLE"));
  await wbd.grantRole(FUNDRAISER_ROLE, deployed.Factory);
  await receiptOFT.setController(deployed.Factory, true);
  console.log("   ✅ Permissions granted");

  // 14. Mint Test USDC
  console.log("\n1️⃣4️⃣  Minting Test USDC...");
  await usdc.mint(deployer.address, ethers.parseUnits("100000", 6));
  console.log("   ✅ Minted 100,000 USDC to deployer");

  // Save
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir);

  fs.writeFileSync(
    path.join(deploymentsDir, "baseSepolia-fresh.json"),
    JSON.stringify(deployed, null, 2)
  );

  console.log("\n\n🎉 DEPLOYMENT COMPLETE!\n");
  console.log("📝 Update your test-frontend/.env.local with:");
  console.log(`NEXT_PUBLIC_FACTORY_ADDRESS=${deployed.Factory}`);
  console.log(`NEXT_PUBLIC_USDC_ADDRESS=${deployed.USDC}`);
  console.log(`NEXT_PUBLIC_AAVE_POOL_ADDRESS=${deployed.AAVE_POOL}`);
  console.log(`NEXT_PUBLIC_WEALTH_BUILDING_ADDRESS=${deployed.WealthBuildingDonation}`);
  console.log("\nAll addresses saved to: deployments/baseSepolia-fresh.json\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
