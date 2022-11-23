import { FlatList, TouchableOpacity } from 'react-native';
import { CartItem } from '../../types/CartItem';
import {
	Item,
	ProductContainer,
	Actions,
	Image,
	QuantityContainer,
	ProductDetails,
	Summary,
	TotalContainer
} from './styles';
import { Text } from '../Text';
import { formatCurrency } from '../../utils/formatCurrency';
import { PlusCircle } from '../Icons/PlusCircle';
import { MinusCircle } from '../Icons/MinusCircle';
import { Button } from '../Button';
import { Product } from '../../types/Product';
import { OrderModalConfirmed } from '../OrderModalConfirmed';
import { useState } from 'react';

interface CartProps{
	cartItems: CartItem[];
	onAdd: (product: Product) => void;
	onRemove: (product: Product) => void;
	onConfirmOrder: () => void;
}

export function Cart({ cartItems, onAdd, onRemove, onConfirmOrder }: CartProps){
	const [isLoading] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const total = cartItems.reduce((acc, cartItem) => {
		return acc + cartItem.quantity * cartItem.product.price;
	}, 0);

	function handleOrderModalConfirmed(){
		setIsModalVisible(true);
	}

	function handleOk(){
		onConfirmOrder();
		setIsModalVisible(false);
	}
	return(
		<>
			<OrderModalConfirmed
				visible={isModalVisible}
				onOk={handleOk}
			/>
			{cartItems.length > 0 && (
				<FlatList
					data={cartItems}
					keyExtractor={cartItem => cartItem.product._id}
					style={{ marginBottom: 20, maxHeight: 150}}
					showsVerticalScrollIndicator={false}
					renderItem={({ item: cartItem }) => (
						<Item>
							<ProductContainer>
								<Image
									source={{
										uri: `http://192.168.1.65:3001/uploads/${cartItem.product.imagePath}`,
									}}
								/>
								<QuantityContainer>
									<Text size={14} color='#666' style={{ marginRight: 5}}>
										{cartItem.quantity}x
									</Text>
								</QuantityContainer>
								<ProductDetails>
									<Text size={14} weight="600">{cartItem.product.name}</Text>
									<Text
										size={14}
										color="#666"
										style={{marginTop: 4}}
									>
										{formatCurrency(cartItem.product.price)}
									</Text>
								</ProductDetails>
							</ProductContainer>
							<Actions>
								<TouchableOpacity onPress={() => onAdd(cartItem.product)} style={{ marginRight: 24 }}>
									<PlusCircle />
								</TouchableOpacity>
								<TouchableOpacity onPress={() => onRemove(cartItem.product)}>
									<MinusCircle />
								</TouchableOpacity>
							</Actions>
						</Item>
					)}
				/>
			)}
			<Summary>
				<TotalContainer>
					{cartItems.length > 0 ? (
						<>
							<Text color="#666">Total</Text>
							<Text size={20} weight="600">{formatCurrency(total)}</Text>
						</>
					) : (
						<>
							<Text color="#999">Seu carrinho está vazio</Text>
						</>
					)}

				</TotalContainer>
				<Button
					onPress={handleOrderModalConfirmed}
					disabled={cartItems.length === 0}
					loading={isLoading}
				>
					Confirmar Pedido
				</Button>
			</Summary>

		</>
	);
}
