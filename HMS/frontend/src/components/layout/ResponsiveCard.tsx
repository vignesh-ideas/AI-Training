import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Skeleton,
} from '@mui/material';
import { MoreVert, Edit, Delete, Visibility } from '@mui/icons-material';

interface ResponsiveCardProps {
  title: string;
  subtitle?: string;
  content?: React.ReactNode;
  image?: string;
  actions?: React.ReactNode;
  chips?: string[];
  loading?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  elevation?: number;
  sx?: any;
}

const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  title,
  subtitle,
  content,
  image,
  actions,
  chips,
  loading = false,
  onClick,
  onEdit,
  onDelete,
  onView,
  elevation = 1,
  sx,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  if (loading) {
    return (
      <Card
        elevation={elevation}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.2s ease-in-out',
          '&:hover': onClick
            ? {
                elevation: elevation + 2,
                transform: 'translateY(-2px)',
              }
            : {},
          ...sx,
        }}
      >
        <CardContent>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="40%" height={24} />
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="text" width="70%" height={20} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      elevation={elevation}
      onClick={onClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick
          ? {
              elevation: elevation + 2,
              transform: 'translateY(-2px)',
            }
          : {},
        ...sx,
      }}
    >
      {image && (
        <CardMedia
          component="img"
          height={isMobile ? '140' : '200'}
          image={image}
          alt={title}
          sx={{
            objectFit: 'cover',
          }}
        />
      )}

      <CardHeader
        title={
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            component="h3"
            noWrap
            sx={{
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            {title}
          </Typography>
        }
        subheader={
          subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {subtitle}
            </Typography>
          )
        }
        action={
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {onView && (
              <IconButton size="small" onClick={(e) => {
                e.stopPropagation();
                onView();
              }}>
                <Visibility fontSize="small" />
              </IconButton>
            )}
            {onEdit && (
              <IconButton size="small" onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}>
                <Edit fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton size="small" onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}>
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Box>
        }
        sx={{
          pb: 1,
          '& .MuiCardHeader-content': {
            minWidth: 0,
          },
        }}
      />

      {chips && chips.length > 0 && (
        <Box sx={{ px: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {chips.slice(0, isMobile ? 2 : 3).map((chip, index) => (
              <Chip
                key={index}
                label={chip}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.7rem',
                  height: 20,
                }}
              />
            ))}
            {chips.length > (isMobile ? 2 : 3) && (
              <Chip
                label={`+${chips.length - (isMobile ? 2 : 3)}`}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.7rem',
                  height: 20,
                }}
              />
            )}
          </Box>
        </Box>
      )}

      {content && (
        <CardContent sx={{ flex: 1, pt: 0 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            {content}
          </Box>
        </CardContent>
      )}

      {actions && (
        <CardActions
          sx={{
            pt: 0,
            px: 2,
            pb: 2,
            justifyContent: 'flex-end',
          }}
        >
          {actions}
        </CardActions>
      )}
    </Card>
  );
};

export default ResponsiveCard; 