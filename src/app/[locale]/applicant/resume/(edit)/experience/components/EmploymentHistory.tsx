'use client';

import { useEffect, useState } from 'react';
import ExperienceForm from './ExperienceForm';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { useQuery } from '@tanstack/react-query';
import { getProfileInfo } from '@/app/api/applicant/experience';
import { objectNullToString } from '@/services/Utility';
import Link from 'next/link';
import { Button } from 'primereact/button';

type EmploymentHistoryProps = {
  initialData: any;
};

const EmploymentHistory = ({ initialData }: EmploymentHistoryProps) => {
  const { data: response, isLoading } = useQuery({
    queryKey: ['experience'],
    queryFn: () => getProfileInfo('experience'),
    initialData: initialData,
  });

  const [isFresher, setIsFresher] = useState<boolean>(
    response.data?.is_fresher,
  );

  const [employment, setEmployment] = useState(
    response.data?.experience.map(
      (data: any) =>
        ({
          ...data,
          isFetched: true,
        } || []),
    ),
  );

  useEffect(() => {
    setIsFresher(response.data?.is_fresher);
    setEmployment(
      response.data?.experience.map((data: any) => ({
        ...data,
        isFetched: true,
      })),
    );
  }, [response]);

  const handleAddEmployment = () => {
    setEmployment([
      ...employment,
      {
        isFetched: false,
      },
    ]);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (response?.success === false) {
    throw new Error((response?.message ?? '').toString());
  }

  return (
    <>
      <div className="mb-10">
        <div className="relative flex items-center">
          <h3 className="w-full py-1 mb-3 text-[23px] font-bold text-[#111928] border-b-2 border-[#d9d9d9] sm:pb-0 pb-[30px]">
            Employment History
          </h3>
          <div className="absolute sm:left-[250px] left-0 sm:top-[10px] top-[40px] flex items-center">
            <div className="flex items-center mr-4">
              <RadioButton
                inputId="fresher"
                name="is_fresher"
                value={true}
                onChange={(e: RadioButtonChangeEvent) =>
                  setIsFresher((prevState) => e.value)
                }
                checked={isFresher === true}
              />
              <label htmlFor="fresher" className="font-semibold text-green-800 text-md">
                Fresher
              </label>
            </div>
            <div className="flex items-center">
              <RadioButton
                inputId="professional"
                name="is_fresher"
                value={false}
                onChange={(e: RadioButtonChangeEvent) =>
                  setIsFresher((prevState) => e.value)
                }
                checked={isFresher === false}
              />
              <label htmlFor="professional" className="text-md font-semibold text-[#db560b]">
                Professional
              </label>
            </div>
          </div>
        </div>
        <div className="bg-[#f2f3f8] p-4 mb-3 rounded-lg border border-[#e2e2e2]">
          {employment.length > 0 ? (
            employment.map((data: any, index: number) => {
              return (
                <ExperienceForm
                  key={`experience-${index}`}
                  isFresher={isFresher}
                  addNewForm={handleAddEmployment}
                  isFetchedArray={data.isFetched}
                  initialData={objectNullToString(data)}
                  isLastChild={index === employment.length - 1}
                />
              );
            })
          ) : (
            <ExperienceForm
              key="experience-new"
              isFresher={isFresher}
              addNewForm={handleAddEmployment}
              isLastChild={true}
            />
          )}
        </div>
        <div className="flex justify-end w-full mb-2">
          <Button
            label="Add Employment (If Required)"
            onClick={handleAddEmployment}
            severity='warning'
            type="button"
            className="rounded-lg text-md w-auto px-5 py-2.5 text-center"
            disabled={isFresher || employment.length === 0}
          />
        </div>
      </div>
      {/* section: next button */}
      <div className="flex justify-end w-full">
        <Link
          href="/applicant/resume/other"
          className="min-w-[275px] text-white bg-[#005DB9] hover:bg-[#004992] focus:ring-2 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-md w-auto px-5 py-2.5 text-center">
          Next<i className="fa fa-circle-chevron-right ms-3"></i>
        </Link>
      </div>
    </>
  );
};

export default EmploymentHistory;
