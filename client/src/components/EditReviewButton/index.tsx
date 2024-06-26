import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Typography } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Review } from '@/src/utils/types';
import { useGetMe } from '@/src/api/auth';
import { pageRoutes } from '@/src/routes/pageRoutes';
import { useGetReview, useGetReviews, useUpdateReview } from '@/src/api/reviews';
import { notificationMessages } from '@/src/utils/notificationMessages.utils';
import ReviewFormModal from '@/src/components/ReviewFormModal';

interface ReviewFormModalButtonProps {
  reviewId: string;
  productId: string
}

const EditReviewButton = ({ reviewId, productId }: ReviewFormModalButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const { data: me, isError, error } = useGetMe();

  if (isError && error?.response?.statusText !== 'Unauthorized')
    throw new Error(error.message);

  const {
    mutate: updateReview,
    isLoading: isUpdateReviewLoading,
    isError: isUpdateReviewError,
    error: addReviewError,
  } = useUpdateReview(reviewId);

  const { refetch } = useGetReviews(productId);
  const { data: review } = useGetReview(reviewId);

  console.log(review)

  const toggleModal = () => {
    if (isModalOpen) {
      setIsModalOpen(false);
      return;
    }

    if (!me) router.push(pageRoutes.singIn());
    setIsModalOpen(true);
  };

  const onSubmit: SubmitHandler<Review> = (data) => {
    updateReview(data, {
      onSuccess: () => {
        setIsModalOpen(false);
        refetch();
        toast.success(notificationMessages.success.updatedReview);
      },
    });
  };

  if (isUpdateReviewError) throw new Error(addReviewError.message);

  return (
    <>
      <Button size="small" onClick={toggleModal}>
        <EditNoteIcon />
        <Typography>Edit</Typography>
      </Button>
      <ReviewFormModal
        title="Update Review"
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        onSubmit={onSubmit}
        isLoading={isUpdateReviewLoading}
        review={review}
      />
    </>
  );
};

export default EditReviewButton;
