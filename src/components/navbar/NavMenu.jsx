import { NavLink } from 'react-router-dom';
import '../navbar/NavMenu.css';

function NavMenu({ items }) {
	return (
		<div className='navbar-menu'>
			<div className='navbar-start'>
				{items.map((item, index) => (
					<NavLink
						key={index}
						to={item.url}
						className={({ isActive, isPending }) =>
							[
								isPending ? 'pending' : '',
								isActive ? 'active navbar-item' : 'navbar-item',
							].join(' ')
						}
					>
						{item.text}
					</NavLink>
				))}
			</div>
		</div>
	);
}

export default NavMenu;
