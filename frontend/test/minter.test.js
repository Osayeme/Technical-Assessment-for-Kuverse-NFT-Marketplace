const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Minter Contract", function () {
  let Minter, minter, owner, addr1, addr2;

  beforeEach(async function () {
    // Deploy the contract before each test
    [owner, addr1, addr2] = await ethers.getSigners();
    const MinterFactory = await ethers.getContractFactory("minter");
    minter = await MinterFactory.deploy();
    await minter.deployed();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await minter.owner()).to.equal(owner.address);
    });

    it("Should initialize totalSupply to 0", async function () {
      expect(await minter.totalSupply()).to.equal(0);
    });

    it("Should set the initial price", async function () {
      expect(await minter.price()).to.equal(ethers.utils.parseEther("0.05"));
    });
  });

  describe("Minting", function () {
    it("Should mint an NFT and update totalSupply", async function () {
      const tokenURI = "ipfs://example-token-uri";

      // Mint an NFT
      await minter.connect(addr1).mint(tokenURI, {
        value: ethers.utils.parseEther("0.05"),
      });

      // Verify the token owner
      expect(await minter.ownerOf(1)).to.equal(addr1.address);

      // Verify tokenURI
      expect(await minter.tokenURI(1)).to.equal(tokenURI);

      // Check totalSupply
      expect(await minter.totalSupply()).to.equal(1);
    });

    it("Should fail if insufficient ETH is sent", async function () {
      const tokenURI = "ipfs://example-token-uri";
      await expect(
        minter.connect(addr1).mint(tokenURI, {
          value: ethers.utils.parseEther("0.01"), // Insufficient funds
        })
      ).to.be.revertedWith("Insufficient funds. You need more ETH.");
    });
  });

  describe("Owner Functions", function () {
    it("Should allow the owner to update the price", async function () {
      const newPrice = ethers.utils.parseEther("0.1");
      await minter.connect(owner).setPrice(newPrice);
      expect(await minter.price()).to.equal(newPrice);
    });

    it("Should prevent non-owners from updating the price", async function () {
      const newPrice = ethers.utils.parseEther("0.1");
      await expect(
        minter.connect(addr1).setPrice(newPrice)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow the owner to withdraw balance", async function () {
      // Mint an NFT to generate contract balance
      await minter.connect(addr1).mint("ipfs://example-token-uri", {
        value: ethers.utils.parseEther("0.05"),
      });

      const initialOwnerBalance = await ethers.provider.getBalance(
        "0xEa9611Ee7C9Cc6d2b21A1d841ca16B703457431E"
      );

      // Withdraw balance
      const tx = await minter.connect(owner).withdrawBalance();
      await tx.wait();

      const finalOwnerBalance = await ethers.provider.getBalance(
        "0xEa9611Ee7C9Cc6d2b21A1d841ca16B703457431E"
      );

      expect(finalOwnerBalance).to.equal(
        initialOwnerBalance.add(ethers.utils.parseEther("0.05"))
      );
    });

    it("Should prevent non-owners from withdrawing balance", async function () {
      await expect(
        minter.connect(addr1).withdrawBalance()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
