/* 
 * A Change is a record of an alteration that a user 
 * has made to the PowerPoint, but a new PowerPoint has
 * yet to be written.
 */

function Change(pptImage, newImageSrc) {
    var self = this;
    self.pptImage = pptImage;
    self.newImageSrc = newImageSrc;
};
