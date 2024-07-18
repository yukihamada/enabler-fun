import React from 'react';
import { Typography, TextField, IconButton, Button, Grid, Paper } from '@mui/material';
import { FaGlobe, FaAirbnb, FaBook } from 'react-icons/fa';
import { MdAdd as AddIcon, MdDelete as DeleteIcon } from 'react-icons/md';
import { useProperty } from '../contexts/PropertyContext';
import { BookingLink } from '../types';

interface BookingLinksSectionProps {
  bookingLinks: BookingLink[];
  onInputChange: (e: { target: { name: string; value: any } }) => void;
  isEditing: boolean;
}

const BookingLinksSection = ({ bookingLinks, onInputChange, isEditing }: BookingLinksSectionProps) => {
  const { property, setProperty } = useProperty()!;
  const [newBookingLink, setNewBookingLink] = React.useState<BookingLink>({ url: '', type: 'other' });

  const handleBookingLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBookingLink({ ...newBookingLink, url: e.target.value });
  };

  const handleBookingLinkTypeChange = (type: BookingLink['type']) => {
    setNewBookingLink({ ...newBookingLink, type });
  };

  const handleAddBookingLink = () => {
    if (newBookingLink.url.trim() !== '' && property) {
      setProperty({
        ...property,
        bookingLinks: [...(property.bookingLinks || []), newBookingLink]
      });
      setNewBookingLink({ url: '', type: 'other' });
    }
  };

  const handleRemoveBookingLink = (index: number) => {
    if (property) {
      const updatedLinks = [...property.bookingLinks];
      updatedLinks.splice(index, 1);
      setProperty({ ...property, bookingLinks: updatedLinks });
    }
  };

  const getBookingLinkIcon = (type: BookingLink['type']) => {
    switch (type) {
      case 'airbnb':
        return <FaAirbnb className="text-red-500" />;
      case 'booking':
        return <FaBook className="text-blue-500" />;
      default:
        return <FaGlobe className="text-green-500" />;
    }
  };

  if (!property) return null;

  return (
    <section className="mb-8">
      <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
        <FaGlobe className="mr-2 text-green-500" /> 予約リンク
      </Typography>
      {isEditing ? (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <TextField
              fullWidth
              value={newBookingLink.url}
              onChange={handleBookingLinkChange}
              placeholder="予約サイトのURL"
              className="flex-grow"
            />
            <IconButton onClick={() => handleBookingLinkTypeChange('airbnb')} color={newBookingLink.type === 'airbnb' ? 'primary' : 'default'}>
              <FaAirbnb />
            </IconButton>
            <IconButton onClick={() => handleBookingLinkTypeChange('booking')} color={newBookingLink.type === 'booking' ? 'primary' : 'default'}>
              <FaBook />
            </IconButton>
            <IconButton onClick={() => handleBookingLinkTypeChange('other')} color={newBookingLink.type === 'other' ? 'primary' : 'default'}>
              <FaGlobe />
            </IconButton>
            <Button onClick={handleAddBookingLink} variant="contained" startIcon={<AddIcon />}>
              追加
            </Button>
          </div>
          <Grid container spacing={2}>
            {property.bookingLinks?.map((link, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper className="p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    {getBookingLinkIcon(link.type)}
                    <Typography className="ml-2 truncate">{link.url}</Typography>
                  </div>
                  <IconButton onClick={() => handleRemoveBookingLink(index)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </div>
      ) : (
        <Grid container spacing={2}>
          {property.bookingLinks?.map((link, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center">
                  {getBookingLinkIcon(link.type)}
                  <Typography className="ml-2 truncate">{link.url}</Typography>
                </div>
              </a>
            </Grid>
          ))}
        </Grid>
      )}
    </section>
  );
};

export default BookingLinksSection;