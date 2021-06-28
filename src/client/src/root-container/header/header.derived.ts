import { IDerivedCalc } from '../../../../Types';
export const derived : IDerivedCalc[] = [
 {
     name: '_xxx',
     from: ['selectedNavItem'],
     spec : function(data : any){
         console.log(data);
         return data;
     }
 },
 {
     name: 'triggerRedirect',
     filterFn: function(data : any){
         return !!data.selectedNavItem;
     },
     from: ['selectedNavItem'],
     spec: function(data : any){
         return true;
     }
 }
]