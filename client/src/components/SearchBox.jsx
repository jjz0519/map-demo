import React, { useState, useCallback } from 'react';
import {
    Paper,
    TextField,
    List,
    ListItem,
    ListItemText,
    Typography,
    Box,
    Rating
} from '@mui/material';
import { debounce } from 'lodash';

const SearchBox = ({ locations, onLocationSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const debouncedSearch = useCallback(
        debounce((term) => {
            if (!term.trim()) {
                setSearchResults([]);
                return;
            }

            const results = locations.filter(location => {
                const searchLower = term.toLowerCase();
                return (
                    location.title.toLowerCase().includes(searchLower) ||
                    location.description.toLowerCase().includes(searchLower)
                );
            });
            setSearchResults(results);
        }, 300),
        [locations]
    );

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    return (
        <Paper
            elevation={3}
            sx={{
                position: 'absolute',
                top: 70,
                left: 90,
                width: 300,
                maxHeight: 400,
                overflow: 'auto',
                zIndex: 1000
            }}
        >
            <Box sx={{ p: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    size="small"
                    autoFocus
                />
            </Box>
            <List>
                {searchResults.map((location) => (
                    <ListItem
                        key={location._id}
                        button
                        onClick={() => onLocationSelect(location)}
                    >
                        <ListItemText
                            primary={location.title}
                            secondary={
                                <>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {location.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                        <Rating
                                            value={location.rating}
                                            readOnly
                                            size="small"
                                            precision={0.5}
                                        />
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ ml: 1 }}
                                        >
                                            ({location.rating})
                                        </Typography>
                                    </Box>
                                </>
                            }
                        />
                    </ListItem>
                ))}
                {searchTerm && searchResults.length === 0 && (
                    <ListItem>
                        <ListItemText
                            primary="No results found"
                            sx={{ textAlign: 'center' }}
                        />
                    </ListItem>
                )}
            </List>
        </Paper>
    );
};

export default SearchBox; 