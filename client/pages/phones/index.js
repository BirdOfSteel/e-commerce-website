import styles from '../../styles/ProductsPage.module.css';
import Layout from '../Layout.tsx';

import PhoneList from './PhoneList';

export default function phonesPage() {
    return (
        <Layout>
            <div className={styles.pageDiv}>
                <ul>
                    <PhoneList />
                </ul>
            </div>
        </Layout>
    )
}