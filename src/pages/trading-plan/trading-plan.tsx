import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import Button from '@/components/shared_ui/button';
import Input from '@/components/shared_ui/input';
import Text from '@/components/shared_ui/text';
import { Localize, localize } from '@deriv-com/translations';
import './trading-plan.scss';

const TradingPlan = observer(() => {
    const [plan, setPlan] = useState({
        name: '',
        initial_balance: '',
        profit_target: '',
        stop_loss: '',
        stake_amount: '',
        daily_goal: '',
    });

    const [saved_plans, setSavedPlans] = useState<any[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('trading_plans');
        if (stored) {
            setSavedPlans(JSON.parse(stored));
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPlan(prev => ({ ...prev, [name]: value }));
    };

    const savePlan = () => {
        if (!plan.name) return;
        const newPlans = [...saved_plans, { ...plan, id: Date.now() }];
        setSavedPlans(newPlans);
        localStorage.setItem('trading_plans', JSON.stringify(newPlans));
        setPlan({
            name: '',
            initial_balance: '',
            profit_target: '',
            stop_loss: '',
            stake_amount: '',
            daily_goal: '',
        });
    };

    const deletePlan = (id: number) => {
        const newPlans = saved_plans.filter(p => p.id !== id);
        setSavedPlans(newPlans);
        localStorage.setItem('trading_plans', JSON.stringify(newPlans));
    };

    const calculateRiskReward = () => {
        const tp = parseFloat(plan.profit_target);
        const sl = parseFloat(plan.stop_loss);
        if (tp && sl) {
            return (tp / sl).toFixed(2);
        }
        return '0.00';
    };

    return (
        <div className='trading-plan'>
            <div className='trading-plan__header'>
                <Text as='h1' weight='bold' size='m' color='prominent'>
                    <Localize i18n_default_text='My Trading Plan' />
                </Text>
                <Text as='p' size='xs' color='less-prominent'>
                    <Localize i18n_default_text='Define your goals and manage your risks effectively.' />
                </Text>
            </div>

            <div className='trading-plan__content'>
                <div className='trading-plan__form-container'>
                    <div className='trading-plan__form'>
                        <Input
                            name='name'
                            type='text'
                            label={localize('Plan Name')}
                            value={plan.name}
                            onChange={handleInputChange}
                            placeholder={localize('E.g. Daily Conservative')}
                        />
                        <div className='trading-plan__form-row'>
                            <Input
                                name='initial_balance'
                                type='number'
                                label={localize('Initial Balance ($)')}
                                value={plan.initial_balance}
                                onChange={handleInputChange}
                            />
                            <Input
                                name='stake_amount'
                                type='number'
                                label={localize('Stake Amount ($)')}
                                value={plan.stake_amount}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='trading-plan__form-row'>
                            <Input
                                name='profit_target'
                                type='number'
                                label={localize('Profit Target ($)')}
                                value={plan.profit_target}
                                onChange={handleInputChange}
                            />
                            <Input
                                name='stop_loss'
                                type='number'
                                label={localize('Stop Loss ($)')}
                                value={plan.stop_loss}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='trading-plan__stats'>
                            <div className='trading-plan__stat-item'>
                                <Text size='xxs' color='less-prominent'>
                                    <Localize i18n_default_text='Risk/Reward Ratio' />
                                </Text>
                                <Text size='s' weight='bold' color='prominent'>
                                    {calculateRiskReward()}
                                </Text>
                            </div>
                        </div>
                        <Button
                            className='trading-plan__save-button'
                            primary
                            large
                            onClick={savePlan}
                            disabled={!plan.name}
                        >
                            <Localize i18n_default_text='Save Plan' />
                        </Button>
                    </div>
                </div>

                <div className='trading-plan__list-container'>
                    <Text as='h2' weight='bold' size='s' color='prominent'>
                        <Localize i18n_default_text='Saved Plans' />
                    </Text>
                    <div className='trading-plan__list'>
                        {saved_plans.length === 0 ? (
                            <div className='trading-plan__empty'>
                                <Text size='xs' color='less-prominent'>
                                    <Localize i18n_default_text='No plans saved yet.' />
                                </Text>
                            </div>
                        ) : (
                            saved_plans.map(p => (
                                <div key={p.id} className='trading-plan__card'>
                                    <div className='trading-plan__card-header'>
                                        <Text weight='bold' color='prominent'>
                                            {p.name}
                                        </Text>
                                        <Button
                                            className='trading-plan__delete-button'
                                            secondary
                                            onClick={() => deletePlan(p.id)}
                                        >
                                            <Localize i18n_default_text='Delete' />
                                        </Button>
                                    </div>
                                    <div className='trading-plan__card-body'>
                                        <div className='trading-plan__card-info'>
                                            <Text size='xxs' color='less-prominent'>
                                                {localize('Balance')}: ${p.initial_balance}
                                            </Text>
                                            <Text size='xxs' color='less-prominent'>
                                                {localize('Stake')}: ${p.stake_amount}
                                            </Text>
                                        </div>
                                        <div className='trading-plan__card-info'>
                                            <Text size='xxs' color='success'>
                                                {localize('TP')}: ${p.profit_target}
                                            </Text>
                                            <Text size='xxs' color='danger'>
                                                {localize('SL')}: ${p.stop_loss}
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default TradingPlan;
