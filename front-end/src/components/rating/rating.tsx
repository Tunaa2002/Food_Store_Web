'use client';

import * as React from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { format } from 'date-fns';
import RatingData from '@/common/interfaces/ratingData';
import createRatingAPI from '@/app/api/user/rating/createRating';
import getRatingAPI from '@/app/api/user/rating/getRating';

const labels: { [index: string]: string } = {
  0: 'Awful',
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

const UserRating = ({ product_id, onReviewSubmitted }: { product_id: number, onReviewSubmitted: () => void }) => {
  const [value, setValue] = React.useState<number | null>(5);
  const [hover, setHover] = React.useState(-1);
  const [showInput, setShowInput] = React.useState(false);
  const [reviewContent, setReviewContent] = React.useState('');
  const [reviews, setReviews] = React.useState<RatingData[]>([]);

  const fetchRatings = async () => {
    const fetchedReviews = await getRatingAPI(product_id);
    setReviews(fetchedReviews);
  };

  React.useEffect(() => {
    fetchRatings();
  }, [product_id]);

  const submitReview = async (newReview: RatingData) => {
    try {
      const response = await createRatingAPI(newReview);
      response.data as RatingData;

      await fetchRatings();
      onReviewSubmitted();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleConfirmReview = () => {
    if (value !== null && reviewContent.trim() !== '') {
      const newReview: RatingData = {
        product_id,
        rating: value,
        comment: reviewContent,
      };
      submitReview(newReview);
      setReviewContent('');
      setShowInput(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100%', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Rating
        name="hover-feedback"
        value={value}
        precision={0.5}
        getLabelText={getLabelText}
        onChange={(event: any, newValue: any) => {
          setValue(newValue);
          setShowInput(true);
        }}
        onChangeActive={(event: any, newHover: any) => {
          setHover(newHover);
        }}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
      />
      {value !== null && (
        <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
      )}
      {showInput && (
        <Box sx={{ mt: 2, width: '100%' }}>
          <TextField
            fullWidth
            label="Nhập nội dung đánh giá"
            variant="outlined"
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            multiline
          />
          <Button
            sx={{ mt: 1 }}
            variant="contained"
            color="primary"
            onClick={handleConfirmReview}
          >
            Xác nhận
          </Button>
        </Box>
      )}
      <Box sx={{ mt: 5, width: '100%', border: '1px solid #ccc', padding: 1, borderRadius: 3}}>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <Box
              key={review.created_at}
              sx={{
                mb: index === reviews.length - 1 ? 0 : 2,
                borderBottom: index === reviews.length - 1 ? 'none' : '1px solid #ccc',
                paddingBottom: 1,
              }}
            >
              <Rating
                name="read-only"
                value={review.rating}
                precision={0.5}
                readOnly
                size="small"
              />
              <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                {review.created_at ? format(new Date(review.created_at), 'dd/MM/yyyy HH:mm') : 'N/A'}
              </Box>
              <Box 
                component="span" 
                sx={{
                  fontWeight: 600,
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  wordBreak: 'break-all',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {review.comment}
              </Box>
            </Box>
          ))
        ) : (
          <Box>Chưa có đánh giá nào</Box>
        )}
      </Box>
    </Box>
  );
};

export default UserRating;
