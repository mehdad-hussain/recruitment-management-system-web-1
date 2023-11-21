'use client';

import { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import keySVG from '@/assets/icons/key.svg';
import checkSVG from '@/assets/icons/check-circle.svg';
import { ChangePasswordSchema } from './changePassword.schema';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { Divider } from 'primereact/divider';
import { useDispatch } from 'react-redux';
import { closeModal } from '@/redux/features/modal.slice';
import { Button } from 'primereact/button';
import { changePassword } from '@/app/api/applicant/dashboard';
import { toastActions } from '@/redux/features/toast.slice';

const defaultValues = {
  old_password: '',
  new_password: '',
  confirm_password: '',
};

const ModalContentForm = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(ChangePasswordSchema),
    mode: 'onTouched',
  });

  // prettier-ignore
  const {  handleSubmit, watch, reset, control, setValue, 
    formState: { errors, isDirty, isValid, isSubmitting, isSubmitSuccessful },
} = methods;

  const passwordHeader = <div className="mb-3 font-bold">Pick a password</div>;

  const suggestionFooter = (
    <>
      <Divider />
      <p className="mt-2">Suggestions</p>
      <ul className="pl-2 mt-0 ml-2 line-height-3">
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li>At least one special character</li>
        <li>Minimum 8 characters</li>
      </ul>
    </>
  );

  const getFormErrorMessage = (name: string) => {
    return errors[name as keyof typeof errors] ? (
      <small className="p-error">
        {errors[name as keyof typeof errors]?.message}
      </small>
    ) : (
      <small className="p-error"></small>
    );
  };

  const dispatch = useDispatch();

  const onSubmit = async (data: any) => {
    const response = await changePassword(data);

    if (response?.success === true) {
      setShowSuccessMessage(true); // Show the success message
    } else if (response?.success === false) {
      dispatch(
        toastActions.showToast({
          message: response?.message as string,
          summary: 'Error',
          type: 'error',
        }),
      );
    }
  };

  return (
    <>
      {!showSuccessMessage ? (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-center justify-center gap-3 mb-6">
              <Image src={keySVG} alt="icon" priority />
              <div className="w-full">
                <Controller
                  name="old_password"
                  control={control}
                  rules={{ required: 'Password is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label
                        htmlFor={field.name}
                        className={classNames(
                          'block mb-1 text-[15px] font-semibold text-gray-800',
                          { 'p-error': errors[field.name]?.message },
                        )}>Current Password <span className="text-[#FF0000] me-1">*</span>
                      </label>
                      <Password
                        placeholder="Type your current password"
                        id={field.name}
                        {...field}
                        inputRef={field.ref}
                        inputClassName="w-full rounded-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 focus"
                        className={classNames(
                          'w-full',
                          { 'p-invalid': fieldState.error },
                        )}
                        feedback={false}
                      />
                      {getFormErrorMessage(field.name)}
                    </>
                  )}
                />
              </div>
              <div className="w-full">
                <Controller
                  name="new_password"
                  control={control}
                  rules={{ required: 'New password is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label
                        htmlFor={field.name}
                        className={classNames(
                          'block mb-1 text-[15px] font-semibold text-gray-800',
                          { 'p-error': errors[field.name]?.message },
                        )}>New Password <span className="text-[#FF0000] me-1">*</span>
                      </label>
                      <Password
                        placeholder="Type your new password"
                        id={field.name}
                        {...field}
                        inputRef={field.ref}
                        inputClassName="w-full rounded-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 focus"
                        feedback={true}
                        header={passwordHeader}
                        footer={suggestionFooter}
                        className={classNames(
                          'w-full',
                          { 'p-invalid': fieldState.error },
                        )}
                      />
                      {getFormErrorMessage(field.name)}
                    </>
                  )}
                />
              </div>
              <div className="w-full">
                <Controller
                  name="confirm_password"
                  control={control}
                  rules={{ required: 'Confirm password is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label
                        htmlFor={field.name}
                        className={classNames(
                          'block mb-1 text-[15px] font-semibold text-gray-800',
                          { 'p-error': errors[field.name]?.message },
                        )}>Retype Password <span className="text-[#FF0000] me-1">*</span>
                      </label>
                      <Password
                        placeholder="Type your new password again"
                        id={field.name}
                        {...field}
                        inputRef={field.ref}
                        inputClassName="w-full rounded-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 focus"
                        className={classNames(
                          'w-full',
                          { 'p-invalid': fieldState.error },
                        )}
                        feedback={false}
                      />
                      {getFormErrorMessage(field.name)}
                    </>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <Button
                label='Cancel'
                type="button"
                onClick={() => dispatch(closeModal('password-change-modal'))}
                severity='secondary'
                className="rounded-lg text-md px-5 py-2.5 text-center"/>
              <Button
                label="Save Changes"
                severity='warning'
                type="submit"
                loading={isSubmitting}
                disabled={!isDirty || !isValid || isSubmitting}
                className="rounded-lg text-md px-5 py-2.5 text-center"
              />
            </div>
          </form>
        </FormProvider>
      ) : (
        <div className="px-4 py-6 space-y-3">
          <div className="flex flex-col items-center justify-center pb-2">
            <Image src={checkSVG} alt="icon" priority />
            <p className="text-[27px] text-gray-600 font-semibold">Success!</p>
            <p className="text-[15px] text-gray-500 font-semibold text-center">
              Your operation has been done successfully!
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              data-modal-hide="successModal"
              className="text-white bg-[#F25F0D] hover:bg-[#db560b] focus:ring-2 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-md px-5 py-2.5 text-center"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalContentForm;
