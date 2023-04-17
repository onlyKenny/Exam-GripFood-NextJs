import Link from 'next/link';
import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import router, { useRouter } from 'next/router';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSwr from 'swr';
import { Client, Restaurant } from '@/functions/swagger/BelajarNextJsBackEnd';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitButton } from '@/components/SubmitButton';
import { InputText } from '@/components/FormControl';
import { Spin, notification } from 'antd';

function pageordersummary(id){
    router.push(`/order-summary/${id}`);
}

const MenuList: React.FC<{
    id: string,
    menu: MenuListModel,
}> = ({ id, menu }) => {
    return (
        <tr>
            <td className="border px-4 py-2"><Link href={`/add-to-cart/${menu.FoodItemId}`}>{menu.Name}</Link></td>
            <td className="border px-4 py-2">{menu.Price}</td>
            <td className="border px-4 py-2">{menu.Qty}</td>
            <button type='button' onClick={pageordersummary(id)}>Submit</button>
        </tr>
    );
};

const IndexPage: Page = () => {
    const router = useRouter();
    const { id } = router.query;

    const fetcher = useSwrFetcherWithAccessToken();
    const restaurantDetailUri = id ? `/api/be/api/Restaurant/${id}` : undefined;
    const { data, mutate } = useSwr<Restaurant>(restaurantDetailUri, fetcher);

    function showList() {
        if (!id) {
            return (
                <Spin tip="Loading..." size='large'></Spin>
            );
        }

        if (typeof id !== 'string') {
            return (
                <Spin tip="Loading..." size='large'></Spin>
            );
        }

        const name = data?.name;
        if (!name) {
            return (
                <Spin tip="Loading..." size='large'></Spin>
            );
        }

        return (
            <MenuList id={id} name={name} onEdit={() => mutate()}></MenuList>
        );
    }

    return (
        <div>
            <Title>Daftar Menu Restoran</Title>
            <Link href='/Restaurant'>Kembali ke List Restoran</Link>

            <h2 className='mb-5 text-3xl'>Daftar Menu Restoran</h2>
            <thead className='bg-slate-700 text-white'>
                    <tr>
                        <th className='px-4 py-2'>Nama</th>
                        <th className='px-4 py-2'>Harga</th>
                        <th className='px-4 py-2'>Kuantitas</th>
                        <th className='px-4 py-2'></th>
                    </tr>
            </thead>

            <tbody>
            {showList()}
            </tbody>
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
