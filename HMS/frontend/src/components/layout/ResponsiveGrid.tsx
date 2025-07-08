import React from 'react';
import { Grid, GridProps, useTheme, useMediaQuery } from '@mui/material';

interface ResponsiveGridProps extends Omit<GridProps, 'container' | 'item'> {
  children: React.ReactNode;
  spacing?: 'xs' | 'sm' | 'md' | 'lg';
  mobileColumns?: 1 | 2;
  tabletColumns?: 1 | 2 | 3;
  desktopColumns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: number;
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  spacing = 'md',
  mobileColumns = 1,
  tabletColumns = 2,
  desktopColumns = 3,
  gap = 2,
  ...gridProps
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const getColumns = () => {
    if (isMobile) return mobileColumns;
    if (isTablet) return tabletColumns;
    return desktopColumns;
  };

  const columns = getColumns();
  const itemWidth = 12 / columns;

  return (
    <Grid
      container
      spacing={gap}
      sx={{
        '& > .MuiGrid-item': {
          minHeight: 'fit-content',
        },
      }}
      {...gridProps}
    >
      {React.Children.map(children, (child) => (
        <Grid
          item
          xs={12}
          sm={isMobile ? 12 : 12 / tabletColumns}
          md={isTablet ? 12 / tabletColumns : 12 / desktopColumns}
          lg={12 / desktopColumns}
          xl={12 / desktopColumns}
        >
          {child}
        </Grid>
      ))}
    </Grid>
  );
};

export default ResponsiveGrid; 