import JobSectionServerWrapper from '@/app/[locale]/(client)/jobs/components/JobSectionServerWrapper';


export const metadata = {
  title: 'Job List'
}

export default function Jobs() {
  return (
    <>
      <JobSectionServerWrapper />
    </>
  );
}
