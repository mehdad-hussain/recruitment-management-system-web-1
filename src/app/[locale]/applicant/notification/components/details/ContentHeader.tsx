'use client';

import { getUserDetail } from '@/app/api/applicant/layout';
import avatar from '@/assets/images/avatar.svg';
import { humanizeTimestamp } from '@/services/Utility';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

interface ContentHeaderProps {
  title: string;
  send_at: string;
  id: number;
}

const ContentHeader = ({ title, send_at, id }: ContentHeaderProps) => {
  const { data: response, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUserDetail(),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 5, // 1 minute
  });

  if (response?.success === false) {
    throw new Error((response?.message ?? '').toString());
  }

  const data = response?.data as any;

  const user = data?.user;

  // const queryClient = useQueryClient();
  // const dispatch = useDispatch();

  return (
    <>
      <div className="grid grid-cols-7 px-4 py-3 bg-white">
        <div className="col-span-5 flex items-center">
          {user?.photo ? (
            <img
              src={user?.photo}
              alt="profile_image"
              className="rounded-full w-14 h-14 object-cover"
            />
          ) : (
            <Image
              priority
              src={avatar}
              className="rounded-full w-14 h-14 object-cover"
              alt="profile_image"
            />
          )}
          <div className="pl-3">
            <span className="text-md font-semibold text-[#22A801]">
              {title}
            </span>
          </div>
        </div>
        <div className="col-span-2 text-end">
          <div className="text-xs text-blue-600">
            {humanizeTimestamp(send_at)}
          </div>

          {/* <button
            onClick={() => dispatch(openModal(`delete-notification-${id}`))}
            className="block float-right justify-end mt-2 text-[#ff0000]"
          >
            <i className="fa fa-trash"></i>
          </button> */}
        </div>
      </div>

      {/* <ConfirmDialog
        id={`delete-notification-${id}`}
        handleDelete={handleDelete}
        isLoading={isDeleting}
      /> */}
    </>
  );
};

export default ContentHeader;
