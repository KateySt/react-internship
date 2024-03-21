import { FieldArray, FieldArrayRenderProps } from 'formik';
import { Chip, Stack, TextField } from '@mui/material';
import React from 'react';
import StyleButton from '../button/StyleButton';

const EditLinks: React.FC<{ newLink: string, setNewLink: (s: string) => void, values: string[] }> = ({
                                                                                                       newLink,
                                                                                                       setNewLink,
                                                                                                       values,
                                                                                                     }) => {
  const handlerAddLinks = (arrayHelpers: FieldArrayRenderProps) => {
    if (newLink.trim() !== '') {
      arrayHelpers.push(newLink);
      setNewLink('');
    }
  };

  return (
    <FieldArray name="user_links">
      {(arrayHelpers) => (
        <>
          <TextField
            id="user_links"
            name="user_links"
            label="Add Link"
            variant="outlined"
            fullWidth
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            error={!!arrayHelpers.form.errors.user_links}
          />
          <Stack direction="column" spacing={1} sx={{ marginTop: '8px' }}>
            {values.map((link: string, index: number) => (
              <Chip
                key={index}
                label={link}
                variant="outlined"
                onDelete={() => arrayHelpers.remove(index)}
              />
            ))}
          </Stack>
          <StyleButton
            text={'Add'}
            onClick={() => handlerAddLinks(arrayHelpers)}
            disabled={!newLink.trim()}
          />
        </>
      )}
    </FieldArray>
  );
};
export default EditLinks;