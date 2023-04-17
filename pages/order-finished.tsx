import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import Link from 'next/link';

const IndexPage: Page = () => {

    return (
        <div>
            <Title>Thank You Page</Title>
            <h2 className='mb-5 text-3xl'>Terima kasih telah berbelanja di GripFood</h2>

            <Link href={'/'}>Kembali ke halaman index.</Link>
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
