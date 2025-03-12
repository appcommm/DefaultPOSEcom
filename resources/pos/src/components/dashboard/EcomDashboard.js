import React from 'react';
import { useSelector } from 'react-redux';
import MasterLayout from '../MasterLayout';
import TabTitle from '../../shared/tab-title/TabTitle';
import { placeholderText } from '../../shared/sharedMethod';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";

const EcomDashboard = () => {
    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText( 'ecom-dashboard.title' )} />
            <iframe width={'100%'} height={'100%'} src="http://localhost:8000/dashboard" title="Ecommerce Dashboard"></iframe>
        </MasterLayout>
    )
}

export default EcomDashboard;
