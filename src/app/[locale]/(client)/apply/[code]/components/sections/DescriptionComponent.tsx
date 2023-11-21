export default function DescriptionComponent({ jobDetailData }: { jobDetailData: any }) {
  return (
    <>
      <div className="col-span-8 job-description">
        <div className="p-4 mx-auto bg-white rounded-lg max-w-screen md:p-8">
          <h2 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-gray-600 md:text-4xl ">
            {jobDetailData.detail.title}
          </h2>
          <div className="relative mb-3">
            <ul className="flex flex-wrap text-center text-gray-500 dark:text-gray-400">
              <li className="flex pr-4 items-center text-[16px]">
                <i className="fa-solid fa-building mr-2 text-[#39B54A]"></i>{' '}
                {jobDetailData.detail.company}
              </li>
              <li className="flex pr-4 items-center text-[16px]">
                <i className="fa-solid fa-clock mr-2 text-[#39B54A]"></i>{' '}
                {jobDetailData.detail.job_type}
              </li>
              <li className="flex pr-4 items-center text-[16px]">
                <i className="fa-sharp fa-solid fa-location-dot mr-2 text-[#39B54A]"></i>{' '}
                {jobDetailData.detail.address}
              </li>
            </ul>
          </div>
          <ol className="relative border-l border-gray-200 mt-7">
            <li className="mb-6 ml-4">
              <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-2 -left-1.5 border border-white"></div>
              <h3 className="text-lg font-semibold text-gray-900">
                Job Context
              </h3>
              <div className="mt-3 mb-4 ml-3 text-sm font-normal leading-5 text-gray-500 des-topic"
                dangerouslySetInnerHTML={{
                  __html: jobDetailData.detail.description,
                }}
              ></div>
            </li>
            <li className="mb-6 ml-4">
              <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-2 -left-1.5 border border-white"></div>
              <h3 className="text-lg font-semibold text-gray-900">
                Job Responsibilities
              </h3>
              <div className="mt-3 mb-4 ml-3 text-sm font-normal leading-5 text-gray-500 des-topic"
                dangerouslySetInnerHTML={{
                  __html: jobDetailData.detail.responsibility,
                }}
              ></div>
            </li>
            <li className="mb-6 ml-4">
              <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-2 -left-1.5 border border-white"></div>
              <h3 className="text-lg font-semibold text-gray-900">
                Educational Requirements
              </h3>
              <div className="mt-2 mb-4 ml-3 text-sm font-normal leading-5 text-gray-500 des-topic"
                dangerouslySetInnerHTML={{
                  __html: jobDetailData.detail.education,
                }}
              ></div>
            </li>
            <li className="mb-6 ml-4">
              <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-2 -left-1.5 border border-white"></div>
              <h3 className="text-lg font-semibold text-gray-900">
                Experience Requirements
              </h3>
              {jobDetailData.detail.experience ? (
                <>
                  <div className="mt-2 mb-4 ml-3 text-sm font-normal leading-5 text-gray-500 des-topic"
                    dangerouslySetInnerHTML={{
                      __html: jobDetailData.detail.experience,
                    }}
                  ></div>
                </>
              ) : (
                <>
                  <div className="mt-2 mb-4 ml-3 text-sm font-normal leading-5 text-gray-500">
                    No Experience Required
                  </div>
                </>
              )}
            </li>
            <li className="mb-6 ml-4">
              <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-2 -left-1.5 border border-white"></div>
              <h3 className="text-lg font-semibold text-gray-900">
                Additional Requirements
              </h3>
              <div className="mt-2 mb-4 ml-3 text-sm font-normal leading-5 text-gray-500 des-topic"
                dangerouslySetInnerHTML={{
                  __html: jobDetailData.detail.additional,
                }}
              ></div>
            </li>
            <li className="mb-6 ml-4">
              <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-2 -left-1.5 border border-white"></div>
              <h3 className="text-lg font-semibold text-gray-900">Salary</h3>
              <div className="mt-3 mb-4 ml-3 text-sm font-normal leading-5 text-gray-500 des-topic"
                dangerouslySetInnerHTML={{
                  __html: jobDetailData.detail.salary,
                }}
              ></div>
            </li>
            <li className="mb-6 ml-4">
              <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-2 -left-1.5 border border-white"></div>
              <h3 className="text-lg font-semibold text-gray-900">
                Compensation & Other Benefits
              </h3>
              <div className="mt-2 mb-4 ml-3 text-sm font-normal leading-5 text-gray-500 des-topic"
                dangerouslySetInnerHTML={{
                  __html: jobDetailData.detail.benefit,
                }}
              ></div>
            </li>
          </ol>
        </div>
      </div>
    </>
  );
}
