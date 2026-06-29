import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/tokens';

import { ExpenseListScreen } from '../screens/ExpenseListScreen';
import { AddExpenseScreen } from '../screens/AddExpenseScreen';
import { EditExpenseScreen } from '../screens/EditExpenseScreen';
import { CategoryManagementScreen } from '../screens/CategoryManagementScreen';
import { MonthlySummaryScreen } from '../screens/MonthlySummaryScreen';

export type ExpensesStackParamList = {
  ExpenseList: undefined;
  AddExpense: undefined;
  EditExpense: { expenseId: number };
  CategoryManagement: undefined;
};

export type SummaryStackParamList = {
  MonthlySummary: undefined;
};

type TabParamList = {
  ExpensesTab: undefined;
  SummaryTab: undefined;
};

const ExpensesStack = createNativeStackNavigator<ExpensesStackParamList>();
const SummaryStack = createNativeStackNavigator<SummaryStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const STACK_OPTIONS = {
  headerStyle: { backgroundColor: colors.neutral[0] },
  headerTintColor: colors.neutral[900],
  headerShadowVisible: false,
  headerTitleStyle: { fontWeight: '700' as const, fontSize: 17, color: colors.neutral[900] },
  contentStyle: { backgroundColor: colors.neutral[100] },
} as const;

function ExpensesNavigator(): React.JSX.Element {
  return (
    <ExpensesStack.Navigator screenOptions={STACK_OPTIONS}>
      <ExpensesStack.Screen
        name="ExpenseList"
        component={ExpenseListScreen}
        options={{ title: 'Gastos' }}
      />
      <ExpensesStack.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{ title: 'Novo Gasto' }}
      />
      <ExpensesStack.Screen
        name="EditExpense"
        component={EditExpenseScreen}
        options={{ title: 'Editar Gasto' }}
      />
      <ExpensesStack.Screen
        name="CategoryManagement"
        component={CategoryManagementScreen}
        options={{ title: 'Categorias' }}
      />
    </ExpensesStack.Navigator>
  );
}

function SummaryNavigator(): React.JSX.Element {
  return (
    <SummaryStack.Navigator screenOptions={STACK_OPTIONS}>
      <SummaryStack.Screen
        name="MonthlySummary"
        component={MonthlySummaryScreen}
        options={{ title: 'Resumo' }}
      />
    </SummaryStack.Navigator>
  );
}

export function AppNavigator(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.brand.primary,
          tabBarInactiveTintColor: colors.neutral[500],
          tabBarStyle: {
            backgroundColor: colors.neutral[0],
            borderTopColor: colors.neutral[200],
            borderTopWidth: 1,
            paddingTop: 4,
            height: 60,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        }}
      >
        <Tab.Screen
          name="ExpensesTab"
          component={ExpensesNavigator}
          options={{
            tabBarLabel: 'Gastos',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="wallet-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="SummaryTab"
          component={SummaryNavigator}
          options={{
            tabBarLabel: 'Resumo',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="bar-chart-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
