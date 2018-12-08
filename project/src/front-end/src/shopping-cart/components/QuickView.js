import React, {Component} from 'react'
import NoResults from '../empty-states/NoResults'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

class QuickView extends Component {
  componentWillUnmount () {
    this.props.closeModal()
  }

  handleClose () {
    this.props.closeModal()
  }

  render () {
    let product = this.props.product
    let name = product.name
    let image = product.image
    let price = product.price
		let bestSellers = product.bestSellers
		let bsList = []
		let view
		if(bestSellers){
			for(var i = 0; i < bestSellers.length; i++){
				bsList.push(
					<div className='product' key={bestSellers[i].name}>
						<h4 className='product-name'>{bestSellers[i].name}<br />{bestSellers[i].price} €/kg</h4>
						<div className='product-image'>
							<img src={bestSellers[i].image} alt={bestSellers[i].name} />
						</div>
						<button type='button' className='search-button' >
	            {/* {this.state.buttonLabel} */}
	          </button>
					</div>
				)
			}
			view = <CSSTransitionGroup
        className='products'
        transitionName='fadeIn'
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300} component='div'>
        {bsList}
      </CSSTransitionGroup>
		}else{
			view = <NoResults />
		}
    return (
      <div className={this.props.openModal ? 'modal-wrapper active' : 'modal-wrapper'}>
        <div className='modal' ref='modal'>
          <button type='button' className='close' onClick={this.handleClose.bind(this)}>&times;</button>
          <center>
            <div className='product'>
              <span className='product-name'>{name}</span>
              <br />
              <span className='product-price'>{price}</span>
              <div className='product-image'>
                <img src={image} alt={name} />
              </div>
            </div>
            <h2>About the product</h2>
            <p>TODO: write down small description...</p>
            <br />
            <h3>Customers who bought this item also bought</h3>
            {view}
          </center>
        </div>
      </div>
    )
  }
}

export default QuickView
