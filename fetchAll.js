require('dotenv').config();
const prisma = require('./src/lib/prisma').default;

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
