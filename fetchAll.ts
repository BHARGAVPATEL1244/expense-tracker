import 'dotenv/config';
import prisma from "./src/lib/prisma";

async function main() {
    const profiles = await prisma.profile.findMany({ include: { transactions: true } });
    const transactions = await prisma.transaction.findMany();
    console.log(JSON.stringify({ profiles, transactions }, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
