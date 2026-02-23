/**
 * 디자인 토큰 (Design Tokens)
 * 색상, 간격, 폰트, 보더 등 공통 스타일을 여기서 관리합니다.
 * 수정이 필요하면 이 파일만 변경하세요.
 */

export const colors = {
  // 메인 색상
  primary: '#4A90D9',
  primaryLight: '#6BA5E7',
  primaryDark: '#3A7BC8',
  primaryBg: '#E8F0FE',

  // 보조 색상
  secondary: '#5CC6BA',
  secondaryLight: '#7DD4CA',
  secondaryDark: '#4AB0A5',

  // 활성/비활성 색상
  active: '#4A90D9',
  inactive: '#B0BEC5',
  activeText: '#FFFFFF',
  inactiveText: '#90A4AE',

  // 텍스트 색상
  textPrimary: '#1A1A2E',
  textSecondary: '#546E7A',
  textTertiary: '#90A4AE',
  textWhite: '#FFFFFF',

  // 배경색
  background: '#F5F7FA',
  backgroundWhite: '#FFFFFF',
  backgroundCard: '#FFFFFF',
  backgroundOverlay: 'rgba(0, 0, 0, 0.5)',

  // 상태 색상
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',
  info: '#2196F3',

  // 위험도 레벨
  riskLow: '#4CAF50',
  riskMedium: '#FF9800',
  riskHigh: '#F44336',

  // 보더 색상
  border: '#E0E6ED',
  borderLight: '#F0F2F5',
  borderFocus: '#4A90D9',

  // 그레이 스케일
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',

  // 탭바
  tabBarBg: '#FFFFFF',
  tabBarBorder: '#E0E6ED',
  tabBarActive: '#4A90D9',
  tabBarInactive: '#B0BEC5',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '24px',
  xxxl: '32px',
  section: '40px',
} as const;

export const borderRadius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  xxl: '20px',
  full: '9999px',
  card: '16px',
  button: '12px',
  input: '10px',
  tag: '20px',
} as const;

export const fontSize = {
  xs: '11px',
  sm: '13px',
  md: '14px',
  base: '15px',
  lg: '16px',
  xl: '18px',
  xxl: '20px',
  xxxl: '24px',
  title: '22px',
  hero: '28px',
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const fontFamily = {
  primary: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  mono: "'SF Mono', 'Fira Code', monospace",
} as const;

export const lineHeight = {
  tight: '1.2',
  normal: '1.5',
  relaxed: '1.7',
} as const;

export const shadow = {
  none: 'none',
  sm: '0 1px 3px rgba(0, 0, 0, 0.06)',
  md: '0 2px 8px rgba(0, 0, 0, 0.08)',
  lg: '0 4px 16px rgba(0, 0, 0, 0.1)',
  xl: '0 8px 24px rgba(0, 0, 0, 0.12)',
  card: '0 2px 12px rgba(0, 0, 0, 0.06)',
  tabBar: '0 -2px 8px rgba(0, 0, 0, 0.04)',
} as const;

export const transition = {
  fast: '0.15s ease',
  normal: '0.25s ease',
  slow: '0.35s ease',
} as const;

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  modal: 300,
  overlay: 400,
  toast: 500,
} as const;

export const layout = {
  maxWidth: '430px',
  headerHeight: '56px',
  tabBarHeight: '80px',
  bottomSafe: '34px',
} as const;

const tokens = {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  fontFamily,
  lineHeight,
  shadow,
  transition,
  zIndex,
  layout,
} as const;

export default tokens;
