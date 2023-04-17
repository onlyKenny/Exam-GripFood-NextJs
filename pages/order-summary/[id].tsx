import { WithDefaultLayout } from '@/components/DefautLayout';
import { SubmitButton } from '@/components/SubmitButton';
import { Title } from '@/components/Title';
import { Client, Cart } from '@/functions/swagger/BelajarNextJsBackEnd';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { Page } from '@/types/Page';
import { faEdit, faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Modal, notification } from 'antd';
import debounce from 'lodash.debounce';
import error from 'next/error';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSwr from 'swr';

const SummaryList: React.FC<{
    cart: CartDetailModel,
    onDeleted: () => void
}> = ({ cart, onDeleted}) => {

    function onClickDelete() {
        Modal.confirm({
            title: `Confirm Delete`,
            content: `Delete product ${cart.name}?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                if (!cart?.id) {
                    return;
                }

                try {
                    const client = new Client('http://localhost:3000/api/be');
                    await client.deleteProduct(cart.id);
                    onDeleted();
                } catch (err) {
                    console.error(err);
                }
            },
        });
    }

    return (
        <tr>
            <td className="border px-4 py-2">{cart.name}</td>
            <td className="border px-4 py-2">{cart.qty}</td>
            <td className="border px-4 py-2">{cart.subtotal}</td>
            <td className="border px-4 py-2">
                <Link href={`/add-to-cart/${cart.id}`} className="inline-block py-1 px-2 text-xs bg-blue-500 text-white rounded-lg">
                    <FontAwesomeIcon className='mr-1' icon={faEdit}></FontAwesomeIcon>
                    Edit Quantity
                </Link>
                <button onClick={onClickDelete} className="ml-1 py-1 px-2 text-xs bg-red-500 text-white rounded-lg">
                    <FontAwesomeIcon className='mr-1' icon={faRemove}></FontAwesomeIcon>
                    Delete
                </button>
            </td>
        </tr>
    );
};

const IndexPage: Page = () => {
    const router = useRouter();
    const { Id } = router.query;

    const fetcher = useSwrFetcherWithAccessToken();
    const restaurantDetailUri = Id ? `/api/be/api/add-to-cart/${Id}` : undefined;
    const { data, mutate } = useSwr<Cart>(restaurantDetailUri, fetcher);

    function renderForm() {
        if (!Id || !data || typeof Id !== 'string') {
            return;
        }

        return (
            <AddCart id={Id} cart={data} onEdited={() => mutate()}></AddCart>
        );
    }

    return (
        <div>
            <Title>Order Summary</Title>
            <h2 className='mb-5 text-3xl'>Order Summary</h2>
            <Link href={`/Restaurant/${Id}`}></Link>

            {Boolean(error) && <Alert type='error' message='Cannot get data' description={String(error)}></Alert>}
            <table className='table-auto mt-5'>
                <thead className='bg-slate-700 text-white'>
                    <tr>
                        <th className='px-4 py-2'>Nama</th>
                        <th className='px-4 py-2'>Harga</th>
                        <th className='px-4 py-2'>Subtotal</th>
                        <th className='px-4 py-2'></th>

                    </tr>
                </thead>
                <tbody>
                    {renderForm()}
                    <p>Total Pesanan: </p>
                </tbody>
            </table>
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
