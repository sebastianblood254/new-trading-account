import { localize } from '@deriv-com/translations';

export type TSidebarItem = {
    label: string;
    content: { data: string; faq_id?: string }[];
    link: boolean;
};

export const SIDEBAR_INTRO = (): TSidebarItem[] => [
    {
        label: localize('Welcome to Deriv Bot!'),
        content: [
            {
                data: localize(
                    'Ready to automate your trading strategy without writing any code? You’ve come to the right place.'
                ),
            },
            { data: localize('Check out these guides and FAQs to learn more about building your bot:') },
        ],
        link: false,
    },
];
