import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const dummyJobs = [
  { title: "Software Engineer", location: "Bangalore, India", collar: "WHITE", company: "TechCorp India", salary: 80000 },
  { title: "Financial Analyst", location: "Mumbai, India", collar: "WHITE", company: "HDFC Bank", salary: 70000 },
  { title: "HR Manager", location: "Delhi, India", collar: "WHITE", company: "Infosys", salary: 60000 },
  { title: "Marketing Executive", location: "Pune, India", collar: "WHITE", company: "Wipro", salary: 55000 },
  { title: "Electrician", location: "Ahmedabad, India", collar: "BLUE", company: "L&T Construction", salary: 25000 },
  { title: "Plumber", location: "Surat, India", collar: "BLUE", company: "BuildIndia", salary: 22000 },
  { title: "Delivery Driver", location: "Jaipur, India", collar: "BLUE", company: "Zomato", salary: 20000 },
  { title: "Factory Operator", location: "Chennai, India", collar: "BLUE", company: "Tata Steel", salary: 28000 },
  { title: "Nurse", location: "Hyderabad, India", collar: "PINK", company: "Apollo Hospitals", salary: 35000 },
  { title: "Teacher", location: "Lucknow, India", collar: "PINK", company: "Delhi Public School", salary: 30000 },
  { title: "Customer Support", location: "Noida, India", collar: "PINK", company: "Amazon India", salary: 28000 },
  { title: "Salon Manager", location: "Kolkata, India", collar: "PINK", company: "Lakme Salon", salary: 25000 },
  { title: "Network Technician", location: "Bhopal, India", collar: "GREY", company: "Airtel", salary: 40000 },
  { title: "Lab Technician", location: "Nagpur, India", collar: "GREY", company: "Dr Reddys", salary: 35000 },
  { title: "Site Supervisor", location: "Indore, India", collar: "GREY", company: "Reliance Industries", salary: 45000 },
  { title: "HVAC Technician", location: "Vadodara, India", collar: "GREY", company: "Blue Star", salary: 38000 },
  { title: "Shop Manager", location: "Agra, India", collar: "MSME", company: "Local Mart", salary: 18000 },
  { title: "Textile Worker", location: "Surat, India", collar: "MSME", company: "Surat Textiles", salary: 15000 },
  { title: "Food Processing Staff", location: "Ludhiana, India", collar: "MSME", company: "Punjab Foods", salary: 16000 },
  { title: "Handicraft Artisan", location: "Jaipur, India", collar: "MSME", company: "Rajasthan Crafts", salary: 14000 },
];

async function run() {
  const employer = await prisma.user.findFirst({ where: { role: "EMPLOYER" } });
  if (!employer) { console.log("No employer found"); process.exit(1); }

  for (const j of dummyJobs) {
    let company = await prisma.company.findFirst({ where: { name: j.company } });
    if (!company) {
      company = await prisma.company.create({
        data: {
          ownerId: employer.id,
          name: j.company,
          slug: j.company.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).slice(2, 5),
          status: "ACTIVE",
        },
      });
    }
    const slug = j.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).slice(2, 6);
    await prisma.job.create({
      data: {
        companyId: company.id,
        postedById: employer.id,
        title: j.title,
        slug,
        description: `${j.title} position at ${j.company}. Great opportunity for candidates in ${j.location}.`,
        location: j.location,
        workMode: "ONSITE",
        employmentType: "FULL_TIME",
        seniority: "MID",
        salaryCurrency: "INR",
        salaryPeriod: "month",
        salaryMin: j.salary,
        salaryMax: Math.round(j.salary * 1.4),
        status: "PUBLISHED",
        publishedAt: new Date(),
        collarType: j.collar,
      },
    });
    console.log(`✓ ${j.title} (${j.collar})`);
  }
  console.log("Done! 20 dummy jobs created.");
  await prisma.$disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
