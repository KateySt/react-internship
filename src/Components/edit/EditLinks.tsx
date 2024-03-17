import { FieldArray, FieldArrayRenderProps } from 'formik';
import { Button, Chip, Stack, TextField } from '@mui/material';
import React from 'react';

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
          <Button
            type="button"
            onClick={() => handlerAddLinks(arrayHelpers)}
            disabled={!newLink.trim()}
          >
            Add
          </Button>
        </>
      )}
    </FieldArray>
  );
};
export default EditLinks;