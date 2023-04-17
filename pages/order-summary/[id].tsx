import { WithDefaultLayout } from '@/components/DefautLayout';
import { SubmitButton } from '@/components/SubmitButton';
import { Title } from '@/components/Title';
import { Client, Cart } from '@/functions/swagger/BelajarNextJsBackEnd';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { Page } from '@/types/Page';
import { faEdit, faPlus, faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Modal, notification } from 'antd';
import debounce from 'lodash.debounce';
import error from 'next/error';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSwr from 'swr';

const SummaryList: React.FC<{
    id: string,
    cart: CartDetailModel,
    onEdited: () => void,
}> = ({ id, cart, onEdited }) => {

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        control
    } = useForm<FormDataType>({
        defaultValues: {
            Qty: cart.Qty,
        },
        resolver: zodResolver(FormSchema)
    });

    async function onSubmit(data: FormDataType) {
        try {
            const client = new Client('http://localhost:3000/api/be');
            await client.updateCart(id, {
                Qty: data.qty,
            });
            reset(data);
            onEdited();
            notification.success({
                message: 'Success',
                description: 'Successfully edited cart data',
                placement: 'bottomRight',
            });
        } catch (error) {
            console.error(error);
        }
    }

    const [search, setSearch] = useState('');
    const params = new URLSearchParams();
    params.append('search', search);
    const brandsUri = '/api/be/api/Carts?' + params.toString();
    const fetcher = useSwrFetcherWithAccessToken();
    const { data, isLoading, isValidating } = useSwr<Cart[]>(brandsUri, fetcher);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor='quantity'>Quantity</label>
                    <button onClick={t => setQty(t.target.valueAsNumber-1)} type='button'>-</button>
                    <input value={Qty} type='number' onChange={t => setQty(t.target.valueAsNumber)}
                        className='block w-full p-1 text-sm rounded-md border-gray-500 border-solid border'></input>
                    <p className='text-red-500'>{errors['quantity']?.message}</p>
                    <button onClick={t => setQty(t.target.valueAsNumber+1)} type='button'>+</button>
                </div>

            <div className='mt-5'>
                <SubmitButton>Submit</SubmitButton>
            </div>
        </form>
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
