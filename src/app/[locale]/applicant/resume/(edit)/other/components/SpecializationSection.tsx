'use client';
import ProfileApi from '@/app/api/applicant/profile';
import { toastActions } from '@/redux/features/toast.slice';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { SpecializationSchema } from '../validation/otherPageValidation';
import SkillFieldArray from './Form/SkillFieldArray';
import { Button } from 'primereact/button';
import { saveProfileInfo } from '@/app/api/applicant/experience';

type SpecializationSectionProps = {
  initialData: any;
};

const defaultValues = {
  skill_description: '',
  skills: [],
  skill: '',
  learn_by: '',
};

const SpecializationSection = ({ initialData }: SpecializationSectionProps) => {
  const { data: response, isLoading }: any = useQuery({
    queryKey: ['skills'],
    queryFn: () => ProfileApi.getProfileInfo('specialization'),
    initialData,
  });

  const methods = useForm({
    resolver: yupResolver(SpecializationSchema),
    defaultValues: {
      ...defaultValues,
      ...response?.data,
    },
    mode: 'onTouched',
  });

  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  // section: save experience
  const { mutate, isLoading: isSaving } = useMutation(saveProfileInfo, {
    onSuccess: () => {
      queryClient.invalidateQueries(['skills']);

      dispatch(
        toastActions.showToast({
          message: 'Successfully saved!',
          type: 'success',
          summary: 'Success',
        }),
      );
    },
    onError: (error: any) => {
      dispatch(
        toastActions.showToast({
          message: error?.message ?? 'Something went wrong',
          type: 'error',
          summary: 'Error',
        }),
      );
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (response?.success === false) {
    throw new Error((response?.message ?? 'Something went wrong').toString());
  }

  // prettier-ignore
  const { handleSubmit,watch, formState: { errors , isDirty, isSubmitSuccessful}} = methods;

  const handleSkillSubmit = (data: any) => {
    data.category = 'specialization';

    const slicedData = {
      ...data,
    };

    delete slicedData.skill;
    delete slicedData.learn_by;
    mutate(slicedData);
  };

  return (
    <>
      <div className="mb-4">
        <div className="my-3 bg-[#f2f3f8] pt-0 px-4 pb-4 rounded-lg border border-[#e2e2e2]">
          <div className="relative flex items-center">
            <h3 className="w-full py-1 mb-3 text-[23px] font-bold text-[#111928] border-b-2 border-[#d9d9d9]">
              Specialization
            </h3>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSkillSubmit)}>
              <SkillFieldArray errors={errors} />

              {/* section: save button */}
              <div className="flex justify-end w-full mt-3">
                <Button
                  severity='success'
                  type="submit"
                  label="Save"
                  className="ms-2 rounded-lg w-auto min-w-[110px] px-9 py-2.5 text-center"
                  loading={isSaving}
                  disabled={!isDirty || watch('skills').length === 0}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default SpecializationSection;
