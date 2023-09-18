import React from 'react';
import { Autocomplete, Box, Paper, PaperProps, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { pageRoutes } from '@/src/routes/pageRoutes';
import Link from 'next/link';
import Image from 'next/image';
import VRHeadset from '../../images/HP_Reverb.png';

const CustomPaper = ({ children }: PaperProps) => {
  return (
    <Paper
      sx={{
        '& .MuiAutocomplete-listbox': {
          bgcolor: 'rgba(0, 0, 0, 0.85)',
          color: 'white',
          "& .MuiAutocomplete-option[aria-selected='true']": {
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            '&.Mui-focused': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
            },
          },
        },
        '& .MuiAutocomplete-listbox .MuiAutocomplete-option.Mui-focused': {
          bgcolor: 'rgba(255, 255, 255, 0.2)',
        },
      }}
    >
      {children}
    </Paper>
  );
};

const SearchBar = () => {
  return (
    <Autocomplete
      freeSolo
      options={top100Films.map((option) => option)}
      PaperComponent={CustomPaper}
      getOptionLabel={(option) =>
        typeof option === 'string' ? '' : option.title
      }
      renderOption={(props, option) => (
        <li {...props}>
          <Link
            href={option.link}
            style={{ color: 'white', textDecoration: 'none', width: '100%' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Image
                src={VRHeadset}
                alt="Apple vision"
                height={50}
                width={50}
              />
              <Box>{option.title}</Box>
            </Box>
          </Link>
        </li>
      )}
      renderInput={({
        InputProps: { startAdornment, ...InputProps },
        ...params
      }) => (
        <Box width="700px">
          <TextField
            hiddenLabel
            variant="standard"
            placeholder="Search"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '3px 15px',
              borderRadius: '20px',
              '& input': {
                color: 'white',
              },
            }}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <SearchIcon
                  sx={{
                    color: '#808080',
                    marginRight: '5px',
                    marginBottom: '2px',
                  }}
                />
              ),
              ...InputProps,
            }}
            {...params}
          />
        </Box>
      )}
    />
  );
};

export default SearchBar;

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994, link: pageRoutes.singIn() },
  { title: 'The Godfather', year: 1972, link: pageRoutes.singIn() },
  { title: 'The Godfather: Part II', year: 1974, link: pageRoutes.singIn() },
  { title: 'The Dark Knight', year: 2008, link: pageRoutes.singIn() },
  { title: '12 Angry Men', year: 1957, link: pageRoutes.singIn() },
  { title: "Schindler's List", year: 1993, link: pageRoutes.singIn() },
  { title: 'Pulp Fiction', year: 1994, link: pageRoutes.singIn() },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
    link: pageRoutes.singIn(),
  },
  {
    title: 'The Good, the Bad and the Ugly',
    year: 1966,
    link: pageRoutes.singIn(),
  },
  { title: 'Fight Club', year: 1999, link: pageRoutes.singIn() },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
    link: pageRoutes.singIn(),
  },
  {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
    link: pageRoutes.singIn(),
  },
];
