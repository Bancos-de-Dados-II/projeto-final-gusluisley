
import { Link } from 'react-router-dom';
import './style.css'
function Charts() {

    return (
        <>
            <div className='div-link'>
                <Link className='link' to='/'>Início</Link>
            </div>
                <iframe className="chart" 
                src="https://charts.mongodb.com/charts-project-0-nwbdkca/embed/dashboards?id=a8796bb4-15ce-4c2f-8605-6c021f3c2726&theme=dark&autoRefresh=true&maxDataAge=300&showTitleAndDesc=true&scalingWidth=scale&scalingHeight=scale">
                </iframe>
            
        </>
    )
}

export default Charts;