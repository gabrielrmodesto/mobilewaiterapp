import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { Categories } from '../components/Categories';
import { Header } from '../components/Header';
import { Menu } from '../components/Menu';
import { TableModal } from '../components/TableModal';
import { Cart } from '../components/Cart';
import { CartItem } from '../types/CartItem';
import { Product } from '../types/Product';
import { ActivityIndicator } from 'react-native';
import {
	Container,
	CategoryContainer,
	MenuContainer,
	Footer,
	CenteredContainer
} from './styles';
import { Empty } from '../components/Icons/Empty';
import { Text } from '../components/Text';
import { Category } from '../types/Category';
import { api } from '../utils/api';

export function Main(){
	const [isLoading, setIsLoading] = useState(true);
	const [isTableModalVisible, setIsTableModalVisible] = useState(false);
	const [selectedTable, setSelectedTable] = useState('');
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);

	useEffect(() => {
		Promise.all([
			api.get('/categories'),
			api.get('/products')
		]).then(([categoriesResponse, productResponse]) => {
			setCategories(categoriesResponse.data);
			setProducts(productResponse.data);
			setIsLoading(false);
		});
		// axios.get('http://192.168.1.65:3001/categories').then((response) => {
		// 	setCategories(response.data);
		// });
		// axios.get('http://192.168.1.65:3001/products').then((response) => {
		// 	setProducts(response.data);
		// });
	}, []);

	function handleSaveTable(table: string){
		setSelectedTable(table);
	}
	function handleResetOrder(){
		setSelectedTable('');
		setCartItems([]);
	}
	function handleAddToCart(product: Product){
		if(!selectedTable){
			setIsTableModalVisible(true);
		}
		setCartItems((prevState) => {
			const itemIndex = prevState.findIndex(
				cartItem => cartItem.product._id === product._id
			);
			if(itemIndex < 0){
				return prevState.concat({
					quantity: 1,
					product
				});
			}

			const newCartItems = [...prevState];
			const item = newCartItems[itemIndex];

			newCartItems[itemIndex] = {
				...item,
				quantity: item.quantity + 1,
			};

			return newCartItems;
		});
	}
	function handleRemoveCartItem(product: Product){
		setCartItems((prevState) => {
			const itemIndex = prevState.findIndex(
				cartItem => cartItem.product._id === product._id
			);
			const item = prevState[itemIndex];
			const newCartItems = [...prevState];

			if(item.quantity === 1){
				newCartItems.splice(itemIndex, 1);

				return newCartItems;
			}

			newCartItems[itemIndex] = {
				...item,
				quantity: item.quantity - 1,
			};

			return newCartItems;
		});
	}

	return(
		<>
			<Container>
				<Header
					selectedTable={selectedTable}
					onCancelOrder={handleResetOrder}
				/>
				{isLoading && (
					<CenteredContainer>
						<ActivityIndicator color="#D73035" size="large" />
					</CenteredContainer>
				)}
				{!isLoading && (
					<>
						<CategoryContainer>
							<Categories
								categories={categories}
							/>
						</CategoryContainer>
						{products.length > 0 ? (
							<>
								<MenuContainer>
									<Menu
										onAddToCart={handleAddToCart}
										products={products}
									/>
								</MenuContainer>
							</>
						) : (
							<CenteredContainer>
								<Empty />
								<Text color='#666' style={{marginTop: 24}}
								>Nenhum produto foi encontrado!</Text>
							</CenteredContainer>
						)}
					</>
				)}

			</Container>
			<Footer>
				{/* <FooterContainer> */}
				{!selectedTable && (
					<Button
						onPress={() => setIsTableModalVisible(true)}
						disabled={isLoading}
					>
						Novo pedido
					</Button>
				)}
				{selectedTable && (
					<Cart
						cartItems={cartItems}
						onAdd={handleAddToCart}
						onRemove={handleRemoveCartItem}
						onConfirmOrder={handleResetOrder}
					/>
				)}
				{/* </FooterContainer> */}
			</Footer>

			<TableModal
				visible={isTableModalVisible}
				onClose={() => setIsTableModalVisible(false)}
				onSave={handleSaveTable}
			/>
		</>
	);
}
