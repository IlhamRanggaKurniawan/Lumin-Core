import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.token.upsert({
    where: {
      address_chainId: {
        address: "0x0000000000000000000000000000000000000000",
        chainId: 11155111, // Sepolia
      },
    },
    update: {},
    create: {
      address: "0x0000000000000000000000000000000000000000",
      chainId: 11155111,
      decimals: 18,
      name: "Ethereum",
      symbol: "ETH",
      imageUrl: "https://static.alchemyapi.io/images/emblems/eth-mainnet.svg",
    },
  })
}

main()
  .then(async () => {
    console.log("✅ Native ETH seeded")
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
