'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { use, useEffect, useRef, useState } from 'react';
// prettier-ignore
import { removeProfileInfo, saveProfileInfo, } from '@/app/api/applicant/experience';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { closeModal, openModal } from '@/redux/features/modal.slice';
import { toastActions } from '@/redux/features/toast.slice';
import { useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { defaultValues } from '../constant';
import { experienceFormSchema } from '../validation/expFormValidation';
import BasicFields from './BasicFields';
import Expertise from './Expertise';

const DynamicReactQuill = dynamic(() => import('react-quill'), {
  ssr: false, // This ensures the component is only rendered on the client side
});

type ExperienceFormProps = {
  addNewForm: () => void;
  isLastChild: boolean;
  isFresher: boolean;
  isFetchedArray?: boolean;
  initialData?: any;
};

const ExperienceForm = ({
  addNewForm,
  isLastChild,
  isFresher,
  isFetchedArray = false,
  initialData,
}: ExperienceFormProps) => {
  const [isFetched, setIsFetched] = useState(isFetchedArray);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [inEditMode, setInEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteFormId, setDeleteFormId] = useState<number>();
  const deleteFormRef = useRef<number>();

  const methods = useForm({
    resolver: yupResolver(experienceFormSchema),
    defaultValues: {
      ...defaultValues,
      is_fresher: isFresher,
      ...initialData,
    },
    mode: 'onTouched',
  });

  // prettier-ignore
  const { handleSubmit, formState: { errors , isDirty}, clearErrors, setValue , control} = methods;

  useEffect(() => {
    setInEditMode(isFresher);
  }, [isFresher]);

  useEffect(() => {
    if (isFresher) {
      clearErrors();
      setValue('is_fresher', true); // update the value of is_fresher field
    } else {
      setValue('is_fresher', false); // update the value of is_fresher field
    }
  }, [isFresher, clearErrors, setValue]);

  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  // section: save experience
  const onSubmit = async (data: any) => {
    data.category = 'experience';
    data.is_fresher = isFresher ? 1 : 0;
    data.is_current = data.is_current ? 1 : 0;
    data.id = initialData?.id;

    const slicedData = { ...data };

    // remove expertise_name , expertise_year and expertise_month from data
    delete slicedData.expertise_name;
    delete slicedData.expertise_year;
    delete slicedData.expertise_month;
    delete slicedData.isFetched;

    setIsSaving(true);
    const response = await saveProfileInfo(slicedData);
    setIsSaving(false);

    if (response.success) {
      queryClient.invalidateQueries(['experience']);
      dispatch(
        toastActions.showToast({
          message: 'Experience has been saved successfully',
          type: 'success',
          summary: 'Success',
        }),
      );

      setIsFetched(true);
      setIsReadOnly(true);
      setInEditMode(false);
    } else {
      dispatch(
        toastActions.showToast({
          message: response.message ?? 'Something went wrong',
          type: 'error',
          summary: 'Error',
        }),
      );
    }
  };

  // section: delete experience

  const deleteProfileInfo = async (id: number) => {
    setIsDeleting(true);
    const response = await removeProfileInfo('experience', id);

    setIsDeleting(false);

    if (response.success) {
      queryClient.invalidateQueries(['experience']);
      dispatch(
        toastActions.showToast({
          message: 'Experience has been deleted successfully',
          type: 'success',
          summary: 'Success',
        }),
      );
      dispatch(closeModal('delete-experience'));
      setIsFetched(true);
      setIsReadOnly(true);
      setInEditMode(false);
    } else {
      dispatch(
        toastActions.showToast({
          message: response.message ?? 'Something went wrong',
          type: 'error',
          summary: 'Error',
        }),
      );
    }
  };
  

  return (
    <>
      <FormProvider {...methods}>
        <form className={'mb-3' + (isFetched === true ? ' p-3 bg-gray-200 border border-[#d9d9d9] rounded-md ' : '')}>
          <div className="grid grid-cols-1 gap-3 mb-3 2xl:grid-cols-4 md:grid-cols-2">
            {/* section: Left Section */}
            <BasicFields
              isFresher={isFresher}
              isReadOnly={inEditMode ? false : isFetched}
            />
            <div className="col-span-1 md:col-span-2">
              {/* section: Right Section */}
              <div className="grid grid-cols-1 gap-3">
                <div className="flex flex-col">
                  <label className={'block mb-1 text-[15px] font-semibold text-gray-800'}>
                    Responsibility
                  </label>
                  <div>
                    <Controller
                      name="responsibility"
                      control={control}
                      render={({ field }) => (
                        <DynamicReactQuill
                          theme="snow"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          readOnly={isReadOnly || isFresher}
                          modules={{
                            toolbar: [
                              ['bold', 'italic', 'underline'],
                              [{ background: [] }, { color: [] }],
                              [{ list: 'bullet' }],
                            ],
                          }}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* section: expertise  */}
                <Expertise
                  isFresher={isFresher}
                  isReadOnly={inEditMode ? false : isFetched}
                  errors={errors}
                />
              </div>
            </div>
          </div>
          {/* section: save & add button */}

          <div className="flex justify-end w-full">
            {!isFetched ? (
              <Button
                onClick={handleSubmit(onSubmit)}
                label="Save"
                className="ms-2 rounded-lg w-auto min-w-[110px] px-9 py-2.5 text-center"
                severity="success"
                loading={isSaving}
              />
            ) : null}

            {isFetched && inEditMode ? (
              <Button
                onClick={handleSubmit(onSubmit)}
                label="Save"
                className="ms-2 rounded-lg w-auto min-w-[110px] px-9 py-2.5 text-center"
                severity="success"
                loading={isSaving}
              />
            ) : null}

            <div className="flex justify-end ">
              {isFetched && !inEditMode ? (
                <Button
                  type="button"
                  onClick={() => setInEditMode(true)}
                  label="Edit"
                  severity="info"
                  className="rounded-lg w-auto min-w-[110px] px-9 py-2.5 text-center"
                />
              ) : null}

              {isFetched ? (
                <Button
                  type="button"
                  onClick={() => {
                    dispatch(openModal('delete-experience'));
                    deleteFormRef.current = initialData?.id;
                  }}
                  label="Delete"
                  severity="danger"
                  loading={isDeleting}
                  className="ms-2 rounded-lg w-auto min-w-[110px] px-9 py-2.5 text-center"
                />
              ) : null}
            </div>
          </div>
        </form>
      </FormProvider>

      <ConfirmDialog
        id={'delete-experience'}
        handleDelete={() => {
          console.log('deleteFormRef.current', deleteFormRef.current);
          deleteProfileInfo(deleteFormRef.current as number);
        }}
        isLoading={isDeleting}
      />
    </>
  );
};

export default ExperienceForm;
