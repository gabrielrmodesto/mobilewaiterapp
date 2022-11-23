import { useState } from 'react';
import { Button } from '../components/Button';
import { Categories } from '../components/Categories';
import { Header } from '../components/Header';
import { Menu } from '../components/Menu';
import { TableModal } from '../components/TableModal';
import { Cart } from '../components/Cart';
import { CartItem } from '../types/CartItem';
import { products as MockProducts } from '../mocks/products';
import { Product } from '../types/Product';
import { ActivityIndicator } from 'react-native';
import {
	Container,
	CategoryContainer,
	MenuContainer,
	Footer,
	FooterContainer,
	CenteredContainer
} from './styles';
import { Empty } from '../components/Icons/Empty';
import { Text } from '../components/Text';

export function Main(){
	const [isLoading] = useState(false);
	const [isTableModalVisible, setIsTableModalVisible] = useState(false);
	const [selectedTable, setSelectedTable] = useState('');
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [products] = useState<Product[]>([]);
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
							<Categories />
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
