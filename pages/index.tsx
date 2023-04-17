import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Client, Restaurant } from '@/functions/swagger/BelajarNextJsBackEnd';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { Page } from '@/types/Page';
import { faEdit, faPlus, faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Modal } from 'antd';
import Link from 'next/link';
import useSwr from 'swr';

const RestaurantTableRow: React.FC<{
    restaurant: Restaurant
}> = ({ restaurant }) => {

    return (
        <tr>
            <td className="border px-4 py-2">{restaurant.id}</td>
            <td className="border px-4 py-2"><Link href={`/Restaurant/${restaurant.id}`}>{restaurant.name}</Link></td>
        </tr>
    );
};

const IndexPage: Page = () => {

    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data, error, mutate } = useSwr<Restaurant[]>('/api/be', swrFetcher);

    return (
        <div>
            <Title>Daftar Restoran</Title>
            <h2 className='mb-5 text-3xl'>Daftar Restoran</h2>

            {Boolean(error) && <Alert type='error' message='Cannot get Restaurants data' description={String(error)}></Alert>}
            <table className='table-auto mt-5'>
                <thead className='bg-slate-700 text-white'>
                    <tr>
                        <th className='px-4 py-2'>ID</th>
                        <th className='px-4 py-2'>Nama</th>
                        <th className='px-4 py-2'></th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((x, i) => <RestaurantTableRow key={i} restaurant={x} ></RestaurantTableRow>)}
                </tbody>
            </table>
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
