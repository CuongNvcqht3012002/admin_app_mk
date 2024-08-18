// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = name => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'Thông tin app',
    path: '/dashboard/setting',
    icon: getIcon('ri:information-fill'),
  },
  {
    title: 'Quản lý nhà xe',
    path: '/dashboard/enterprise',
    icon: getIcon('ri:car-line'),
  },
  {
    title: 'Quản lý gói nâng cấp',
    path: '/dashboard/premium-package',
    icon: getIcon('ph:package-thin'),
  },
  {
    title: 'Quản lý khu vực',
    path: '/dashboard/region',
    icon: getIcon('ph:train-regional-light'),
  },
  {
    title: 'Quản lý banner',
    path: '/dashboard/banner',
    icon: getIcon('ph:flag-banner-bold'),
  },
  {
    title: 'Quản lý danh sách yêu cầu xét duyệt',
    path: '/dashboard/indentity',
    icon: getIcon('clarity:indent-line'),
  },
  {
    title: 'Quản lý danh mục xe',
    path: '/dashboard/vehicle-category',
    icon: getIcon('material-symbols:topic-outline'),
  },
  {
    title: 'Quản lý người dùng',
    path: '/dashboard/user',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Quản lý tài xế',
    path: '/dashboard/driver',
    icon: getIcon('healthicons:truck-driver-outline'),
  },
  {
    title: 'Quản lý đơn đặt cọc',
    path: '/dashboard/book-deposit',
    icon: getIcon('material-symbols:fiber-new'),
  },
  {
    title: 'Quản lý lệnh rút tiền',
    path: '/dashboard/wallet',
    icon: getIcon('arcticons:raiffeisen-e-banking'),
  },
  {
    title: 'Quản lý lệnh nạp tiền',
    path: '/dashboard/walletRecharge',
    icon: getIcon('arcticons:raiffeisen-e-banking'),
  },
  {
    title: 'Quản lý tin tức',
    path: '/dashboard/post',
    icon: getIcon('flat-color-icons:about'),
  },
  {
    title: 'Quản lý thông báo',
    path: '/dashboard/notification',
    icon: getIcon('carbon:notification'),
  },
  {
    title: 'Quản lý đơn',
    path: '/dashboard/booking',
    icon: getIcon('material-symbols:order-approve'),
  },
  {
    title: 'Quản lý đơn admin đặt',
    path: '/dashboard/book-by-admin',
    icon: getIcon('ph:bank-light'),
  }
];

export default sidebarConfig;
