import { Typography } from "antd";

interface PageTitleProps {
  title: string;
}

const { Title } = Typography;

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  return <Title level={2}>{title}</Title>;
};

export default PageTitle;
