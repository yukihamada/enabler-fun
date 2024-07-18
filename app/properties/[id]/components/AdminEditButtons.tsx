import React from 'react';
import { Fab } from '@mui/material';
import { MdEdit as EditIcon, MdSave as SaveIcon, MdCancel as CancelIcon } from 'react-icons/md';

interface AdminEditButtonsProps {
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
}

const AdminEditButtons: React.FC<AdminEditButtonsProps> = ({
  isEditing,
  onSave,
  onCancel,
  onEdit,
}) => {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000
    }}>
      {isEditing ? (
        <>
          <Fab
            color="primary"
            aria-label="save"
            onClick={onSave}
            style={{ marginRight: '10px' }}
          >
            <SaveIcon />
          </Fab>
          <Fab
            color="secondary"
            aria-label="cancel"
            onClick={onCancel}
          >
            <CancelIcon />
          </Fab>
        </>
      ) : (
        <Fab
          color="primary"
          aria-label="edit"
          onClick={onEdit}
        >
          <EditIcon />
        </Fab>
      )}
    </div>
  );
};

export default AdminEditButtons;