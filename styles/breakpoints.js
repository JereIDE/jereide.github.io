export const breakpoints = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 9999,
};

export const getBreakpoint = (width) => {
  const { xs, sm, md, lg } = breakpoints;

  if (width <= xs) {
    return 'xs';
  }
  if (width > xs && width <= sm) {
    return 'sm';
  }
  if (width > sm && width <= md) {
    return 'md';
  }
  if (width > md && width <= lg) {
    return 'lg';
  }
  if (width > lg) {
    return 'xl';
  }
};

export const mediaQueries = {
  // small phones
  xs: `only screen and (max-width: ${breakpoints.xs}px)`,
  // most phones
  sm: `only screen and (max-width: ${breakpoints.sm}px)`,
  // tablets
  md: `only screen and (max-width: ${breakpoints.md}px)`,
  // large tablets and small desktops
  lg: `only screen and (max-width: ${breakpoints.lg}px)`,
  // large desktops
  xl: `only screen and (min-width: ${breakpoints.lg + 1}px)`,
};

/* Updated ranges: xs ≤480, sm 481–576, md 577–768, lg 769–1024, xl ≥1025 */
/*
////////////////////////////////////
// ... xs | sm | md | lg | xl ... //
// ============================== //
// min  xs : 0 - Infinity         //
// ...------------------------... //
// only xs : 0 - 479              //
// ...----|                       //
// max  xs : 0 - 479              //
// ...----|                       //
// min  sm : 480 - Infinity       //
//        |-------------------... //
// only sm : 480 - 575            //
//        |----|                  //
// max  sm : 0 - 576              //
// ...---------|                  //
// min  md : 576 - Infinity       //
//             |--------------... //
// only md : 576 - 768            //
//             |----|             //
// max  md : 0 - 768              //
// ...--------------|             //
// min  lg : 769 - Infinity       //
//             |--------------... //
// only lg : 769 - 1024           //
//             |----|             //
// max  lg : 0 - 1024             //
// ...--------------|             //
// min  xl : 1025 - Infinity      //
//                       |----... //
// only xl : 1025 - Infinity      //
//                       |----... //
// max  xl : 0 - Infinity         //
// ...------------------------... //
////////////////////////////////////
*/
