'use client';

import * as React from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { format } from 'date-fns';

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

interface Review {
  rating: number;
  content: string;
  created_at: string;
}

function UserRating() {
  const [value, setValue] = React.useState<number | null>(5);
  const [hover, setHover] = React.useState(-1);
  const [showInput, setShowInput] = React.useState(false);
  const [reviewContent, setReviewContent] = React.useState('');
  const [reviews, setReviews] = React.useState<Review[]>([]);

  const handleConfirmReview = () => {
    if (value !== null && reviewContent.trim() !== '') {
      const newReview: Review = {
        rating: value,
        content: reviewContent,
        created_at: format(new Date(), 'dd/MM/yyyy HH:mm')
      };
      setReviews([...reviews, newReview]);
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
      <Box sx={{ mt: 2, width: '100%' }}>
        {reviews.map((review, index) => (
          <Box key={index} sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}>
            <Rating value={review.rating} readOnly precision={0.5} />
            <Box sx={{ mt: 1, fontSize: '0.875em', color: 'gray' }}>
              {review.created_at}
            </Box>
            <Box sx={{ mt: 1 }}>{review.content}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default UserRating;
