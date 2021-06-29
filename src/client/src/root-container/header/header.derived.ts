import { IDerivedCalc } from '../../../../Types';
export const derived : IDerivedCalc[] = [
 {
     name: '_xxx',
     from: ['selectedNavItem'],
     spec : function(data : any){
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
 },
 {
     name: 'redirectURL',
     from: ['triggerRedirect','selectedNavItem'],
     filterFn: function(data : any, trigger : string){
        return trigger==='triggerRedirect' && !!data.selectedNavItem;
     },
     spec: function(data : any){
        return '/products/'+data.selectedNavItem;
     }
 }
]