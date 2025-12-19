-- Seed Enterprise Platforms Books
-- Run this in Supabase SQL Editor to populate the new category

INSERT INTO public.books (title, author, description, url, category, tags, year, pages)
VALUES 
(
  'Mastering Active Directory',
  'Dishan Francis',
  'Design, deploy, and protect Active Directory Domain Services for Windows Server 2022.',
  'https://www.amazon.com/Mastering-Active-Directory-deploy-Services/dp/1801077716',
  'Enterprise Platforms',
  ARRAY['Active Directory', 'Windows Server', 'Identity Management'],
  '2021',
  '830 pages'
),
(
  'Cloud Security: A Comprehensive Guide to Secure Cloud Computing',
  'Ronald L. Krutz, Russell Dean Vines',
  'Comprehensive overview of cloud security concepts, data protection, and compliance.',
  'https://www.amazon.com/Cloud-Security-Comprehensive-Secure-Computing/dp/0470589876',
  'Enterprise Platforms',
  ARRAY['Cloud Security', 'AWS', 'Azure'],
  '2010',
  '384 pages'
),
(
  'Kubernetes Security',
  'Liz Rice, Michael Hausenblas',
  'Operating Kubernetes clusters and applications safely and securely.',
  'https://www.amazon.com/Kubernetes-Security-Operating-Clusters-Applications/dp/1492039089',
  'Enterprise Platforms',
  ARRAY['Kubernetes', 'Container Security', 'DevSecOps'],
  '2019',
  '158 pages'
),
(
  'Enterprise Security Architecture',
  'Nicholas Sherwood, Andrew Clark, David Lynas',
  'A Business-Driven Approach to enterprise security architecture using the SABSA framework.',
  'https://www.amazon.com/Enterprise-Security-Architecture-Business-Driven-Approach/dp/157820318X',
  'Enterprise Platforms',
  ARRAY['Architecture', 'SABSA', 'Strategy'],
  '2005',
  '600 pages'
),
(
  'Docker Security',
  'Adrian Mouat',
  'Using Docker Safely: A guide to container security for developers and ops.',
  'https://www.amazon.com/Using-Docker-Safely-Adrian-Mouat/dp/1491932595',
  'Enterprise Platforms',
  ARRAY['Docker', 'Containers', 'DevOps'],
  '2015',
  '120 pages'
),
(
  'Microsoft Azure Security',
  'Michael Howard, Yaniv Shaked',
  'Designing and building secure cloud solutions on Microsoft Azure.',
  'https://www.amazon.com/Microsoft-Azure-Security-Michael-Howard/dp/1509303534',
  'Enterprise Platforms',
  ARRAY['Azure', 'Microsoft', 'Cloud'],
  '2020',
  '400 pages'
);
