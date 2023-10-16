import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { Resource } from '@app/@core/models/resources/resources.model';
import { mapKeyToObjectOperator } from '@app/@core/utilities/mappings.utilities';
import { Observable, defer, of } from 'rxjs';

export const RESOURCES_STRING = 'resources';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

  constructor(
    private db: AngularFireDatabase,
  ) { }

  // // *** Resources API ***

  private resourcesListRef(): AngularFireList<Resource> {
    return this.db.list(RESOURCES_STRING)
  }
  
  private resourcesObjectRef(rid: string): AngularFireObject<Resource> {
    return this.db.object(`${RESOURCES_STRING}/${rid}`)
  }

  getResources():Observable<Resource[]> {
    return this.resourcesListRef()
    .valueChanges([], { idField: 'id' })
  }

  getActiveResources():Observable<Resource[]> {
    const activeResourcesRef = this.db.list(
      `${RESOURCES_STRING}`,
      ref => ref.orderByChild("active").equalTo(true)
    );

    return <Observable<Resource[]>>activeResourcesRef
      .valueChanges([], { idField: 'id' });
  }
  
  getResource(rid: string):Observable<Resource> {
    return this.resourcesObjectRef(`${RESOURCES_STRING}/${rid}`)
      .snapshotChanges()
      .pipe( mapKeyToObjectOperator() );
  }

  toggleResourceIsActive(resource: Resource) : Observable<void> {
    return defer( () => this.resourcesObjectRef(resource.id).update({active: !resource.active }))
  }

  removeResource(resource: Resource) : Observable<void> {
    return defer( () => this.resourcesObjectRef(resource.id).remove())
  }

  addResource(resource: Resource): Observable<string | null>  {
    return of(this.resourcesListRef().push(resource).key)
  }

  saveResource(resource: Resource): Observable<void> {
    const { id, ...resourceObject } = resource;
    const updateRef = this.resourcesObjectRef(id);
    return defer( () => updateRef.update({ ...resourceObject }));
  }
}
