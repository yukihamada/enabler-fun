import { useTranslation } from 'next-i18next';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Paper, Typography, Box, Button } from '@mui/material';

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsProps {
  reviews: Review[];
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }) => void;
}

export default function Reviews({ reviews }: ReviewsProps) {
  const { t } = useTranslation('common');

  const reviewExcerpts = [
    "「写真通りの素敵な宿でした。大きな窓から海が見え、素晴らしいステイが出来ました。」",
    "「白を基調とした素敵なお部屋でした。大きな窓のオーシャンビューで夕日なども綺麗で良い時間を過ごすことができました。」",
    "「景色も良く、快適に過ごせました。アメニティ類や、設備等の不備もなく満足です。」",
    "「カラオケやバーベキュー、サウナも楽しむことができました。アメニティもしっかり揃ってて、着の身着のままで大丈夫でした。」"
  ];

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', borderBottom: 1, pb: 2, mb: 3 }}>
        {t('reviews')}
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic', color: 'text.secondary' }}>
        全体的に、オーシャンビューの景色の素晴らしさや、設備の充実ぶり、清潔感などが高評価を得ているようです。
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        {reviewExcerpts.map((excerpt, index) => (
          <Paper key={index} elevation={1} sx={{ p: 2, mb: 2, backgroundColor: 'background.default' }}>
            <Typography variant="body2">{excerpt}</Typography>
          </Paper>
        ))}
      </Box>
      
      <Button
        component={Link}
        href="https://www.airbnb.jp/rooms/51164447"
        variant="contained"
        color="primary"
        target="_blank"
        rel="noopener noreferrer"
        sx={{ mb: 4, borderRadius: '20px' }}
      >
        Airbnbでの全レビューを見る
      </Button>
      
      <Box sx={{ mt: 4 }}>
        {reviews.map((review) => (
          <Paper key={review.id} elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'background.paper' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ mr: 2 }}>{review.author}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {[...Array(5)].map((_, i) => {
                  const starValue = Math.min(Math.max(review.rating - i, 0), 1);
                  return (
                    <Box key={i} sx={{ position: 'relative', width: 20, height: 20 }}>
                      <StarIconOutline style={{ width: '100%', height: '100%', color: 'action.disabled' }} />
                      <Box sx={{ position: 'absolute', top: 0, left: 0, overflow: 'hidden', width: `${starValue * 100}%` }}>
                        <StarIconSolid style={{ width: 20, height: 20, color: 'warning.main' }} />
                      </Box>
                    </Box>
                  );
                })}
                <Typography variant="body2" sx={{ ml: 1 }}>{review.rating.toFixed(2)}</Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ mb: 2 }}>{review.comment}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{review.date}</Typography>
          </Paper>
        ))}
      </Box>
    </Paper>
  );
}