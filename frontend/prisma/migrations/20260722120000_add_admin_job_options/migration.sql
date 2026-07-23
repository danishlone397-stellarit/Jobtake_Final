CREATE TYPE "JobOptionType" AS ENUM ('LOCATION', 'INDUSTRY', 'ROLE', 'CTC', 'EXPERIENCE');

CREATE TABLE "JobOption" (
    "id" TEXT NOT NULL,
    "type" "JobOptionType" NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobOption_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "JobOption_type_value_key" ON "JobOption"("type", "value");
CREATE INDEX "JobOption_type_active_sortOrder_idx" ON "JobOption"("type", "active", "sortOrder");

INSERT INTO "JobOption" ("id", "type", "label", "value", "description", "sortOrder", "active", "updatedAt") VALUES
('jobopt_location_mumbai', 'LOCATION', 'Mumbai, India', 'Mumbai, India', 'Primary hiring location', 0, true, CURRENT_TIMESTAMP),
('jobopt_location_bengaluru', 'LOCATION', 'Bengaluru, India', 'Bengaluru, India', 'Primary hiring location', 1, true, CURRENT_TIMESTAMP),
('jobopt_location_delhi', 'LOCATION', 'Delhi NCR, India', 'Delhi NCR, India', 'Primary hiring location', 2, true, CURRENT_TIMESTAMP),
('jobopt_location_pune', 'LOCATION', 'Pune, India', 'Pune, India', 'Primary hiring location', 3, true, CURRENT_TIMESTAMP),
('jobopt_location_hyderabad', 'LOCATION', 'Hyderabad, India', 'Hyderabad, India', 'Primary hiring location', 4, true, CURRENT_TIMESTAMP),
('jobopt_location_remote', 'LOCATION', 'Remote', 'Remote', 'Remote hiring option', 5, true, CURRENT_TIMESTAMP),
('jobopt_industry_it', 'INDUSTRY', 'IT & Software', 'IT & Software', 'Technology and software companies', 0, true, CURRENT_TIMESTAMP),
('jobopt_industry_manufacturing', 'INDUSTRY', 'Manufacturing', 'Manufacturing', 'Manufacturing and industrial companies', 1, true, CURRENT_TIMESTAMP),
('jobopt_industry_healthcare', 'INDUSTRY', 'Healthcare', 'Healthcare', 'Healthcare and hospitals', 2, true, CURRENT_TIMESTAMP),
('jobopt_industry_finance', 'INDUSTRY', 'Finance & Banking', 'Finance & Banking', 'Banking, finance, and fintech', 3, true, CURRENT_TIMESTAMP),
('jobopt_industry_retail', 'INDUSTRY', 'Retail & FMCG', 'Retail & FMCG', 'Retail, ecommerce, and FMCG', 4, true, CURRENT_TIMESTAMP),
('jobopt_industry_construction', 'INDUSTRY', 'Construction', 'Construction', 'Construction and infrastructure', 5, true, CURRENT_TIMESTAMP),
('jobopt_role_software_engineer', 'ROLE', 'Software Engineer', 'Software Engineer', 'Common job role', 0, true, CURRENT_TIMESTAMP),
('jobopt_role_sales_executive', 'ROLE', 'Sales Executive', 'Sales Executive', 'Common job role', 1, true, CURRENT_TIMESTAMP),
('jobopt_role_hr_manager', 'ROLE', 'HR Manager', 'HR Manager', 'Common job role', 2, true, CURRENT_TIMESTAMP),
('jobopt_role_customer_support', 'ROLE', 'Customer Support', 'Customer Support', 'Common job role', 3, true, CURRENT_TIMESTAMP),
('jobopt_role_factory_operator', 'ROLE', 'Factory Operator', 'Factory Operator', 'Common job role', 4, true, CURRENT_TIMESTAMP),
('jobopt_role_delivery_driver', 'ROLE', 'Delivery Driver', 'Delivery Driver', 'Common job role', 5, true, CURRENT_TIMESTAMP),
('jobopt_ctc_0_3', 'CTC', '0 - 3 LPA', '0-3', 'Salary band in LPA', 0, true, CURRENT_TIMESTAMP),
('jobopt_ctc_3_6', 'CTC', '3 - 6 LPA', '3-6', 'Salary band in LPA', 1, true, CURRENT_TIMESTAMP),
('jobopt_ctc_6_10', 'CTC', '6 - 10 LPA', '6-10', 'Salary band in LPA', 2, true, CURRENT_TIMESTAMP),
('jobopt_ctc_10_15', 'CTC', '10 - 15 LPA', '10-15', 'Salary band in LPA', 3, true, CURRENT_TIMESTAMP),
('jobopt_ctc_15_25', 'CTC', '15 - 25 LPA', '15-25', 'Salary band in LPA', 4, true, CURRENT_TIMESTAMP),
('jobopt_ctc_25_plus', 'CTC', '25+ LPA', '25-', 'Salary band in LPA', 5, true, CURRENT_TIMESTAMP),
('jobopt_exp_fresher', 'EXPERIENCE', 'Fresher', '0-0', 'Experience band in years', 0, true, CURRENT_TIMESTAMP),
('jobopt_exp_0_1', 'EXPERIENCE', '0 - 1 years', '0-1', 'Experience band in years', 1, true, CURRENT_TIMESTAMP),
('jobopt_exp_1_3', 'EXPERIENCE', '1 - 3 years', '1-3', 'Experience band in years', 2, true, CURRENT_TIMESTAMP),
('jobopt_exp_3_5', 'EXPERIENCE', '3 - 5 years', '3-5', 'Experience band in years', 3, true, CURRENT_TIMESTAMP),
('jobopt_exp_5_10', 'EXPERIENCE', '5 - 10 years', '5-10', 'Experience band in years', 4, true, CURRENT_TIMESTAMP),
('jobopt_exp_10_plus', 'EXPERIENCE', '10+ years', '10-', 'Experience band in years', 5, true, CURRENT_TIMESTAMP);
