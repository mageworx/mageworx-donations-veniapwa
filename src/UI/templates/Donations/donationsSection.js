import React, { Suspense } from 'react';
import { useIntl } from 'react-intl';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { Section } from "@magento/venia-ui/lib/components/Accordion";

const Donations = React.lazy(() => import('../../organisms/Donations/donations'));

const DonationsSection = props => {
    const { setIsCartUpdating } = props;
    const { formatMessage } = useIntl();
    return (
        <Section
            id={'donations_mw'}
            title={formatMessage({
                id: 'MageWorx.donations.section',
                defaultMessage: 'Donations'
            })}
        >
            <Suspense fallback={<LoadingIndicator />}>
                <Donations setIsCartUpdating={setIsCartUpdating} />
            </Suspense>
        </Section>
    );
};

export default DonationsSection;
