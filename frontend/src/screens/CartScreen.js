import { useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { Link } from 'react-router-dom';
import {addToCart, removeFromCart} from '../actions/cartAction';
import MessageBox from '../components/MessageBox';


export default function CartScreen(props) {
  const productId = props.match.params.id;
  const qty = props.location.search? Number(props.location.search.split('=')[1]) : 1;
  const cart = useSelector(state => state.cart)
  const { cartItems } = cart 
  const options = [1,2,3,4,5,6,7,8,9,10];

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(addToCart(productId, qty))
  }, [dispatch, productId, qty])
  
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }
  const checkoutHandler = () => {
    props.history.push('/signin?redirect=shipping')
  }
  return(
    <div className="row top">
      <div className="col-2">
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? <MessageBox>Cart is empty. <Link to="/">Go shopping</Link></MessageBox>
          : (
            <ul>
              {
                cartItems.map((item) => (
                  <li key={item.product}>
                    <div className="row" >
                      <div>
                        <img className="small" src={item.image} alt={item.name} />
                      </div>
                      <div className="min-30">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </div>
                      <div>
                        <select 
                          value={item.qty} 
                          onChange={e => dispatch(addToCart(item.product, Number(e.target.value)))}
                        >
                          {
                            options.map((value) =>{
                              return <option key={value} value={value}>{value}</option>
                            })
                          }
                        </select>
                      </div>
                      <div>Rs. {item.price}</div>
                      <div>
                        <button type="button" onClick={() => removeFromCartHandler(item.product)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              }
            </ul>
          )
        }
      </div>
      <div className="col-1">
        <div className="card card-body">
          <ul>
            <li>
              <h2>Subtotal ({cartItems.reduce((a,c) => a + c.qty,0)} items) 
                : {cartItems.reduce((a,c) => a + c.price * c.qty, 0)}
              </h2>
            </li>
            <li>
              <button type="button" onClick={checkoutHandler} className="primary block" disabled={cartItems.length===0}>Proceed to checkout</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}